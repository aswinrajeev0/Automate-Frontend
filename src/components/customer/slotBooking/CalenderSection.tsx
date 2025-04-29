import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { BookedSlot } from "./BookedSlots";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useParams, useSearchParams } from "react-router-dom";
import { BookSlot, useAvailableDates, useBookSlot, useCheckSlotAvailability, useFetchAvailableSlots, useSaveSlotId } from "../../../hooks/customer/useSlotBooking";
import PaymentModal from "../payment/PaymentModal";
import ConfirmationModal from "../carLift/ConfirmationModal";
import FailedModal from "../carLift/FailedModal";
import { useToaster } from "../../../hooks/ui/useToaster";

export interface WorkshopSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: "basic" | "interim" | "full";
  maxBookings: number;
  currentBookings: number;
  isAvailable: boolean;
}

interface CalenderSectionProps {
  setBookingSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  bookedSlots: BookedSlot[];
}

const SERVICE_DURATIONS: Record<string, number> = {
  basic: 1,
  interim: 2,
  full: 3,
};

const CalenderSection: React.FC<CalenderSectionProps> = ({ setBookingSubmitted }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<WorkshopSlot | null>(null);
  const [overlappingServiceInfo, setOverlappingServiceInfo] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const { successToast, errorToast } = useToaster();

  const { workshopId } = useParams<{ workshopId: string }>();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") || "basic") as keyof typeof SERVICE_DURATIONS;

  const { customer } = useSelector((state: RootState) => state.customer);
  const bookSlot = useBookSlot(workshopId as string, type);

  const serviceDuration = SERVICE_DURATIONS[type] || 1;

  // Fetch available slots
  const { data: availableSlotData = [], isLoading: isSlotsLoading, refetch: refetchSlots } = useFetchAvailableSlots(workshopId as string, selectedDate || new Date(), type);
  const workshopSlots = (availableSlotData?.slots || []) as WorkshopSlot[]
  // Fetch available dates
  const { data: availableDatesData, isLoading: isLoadingDates, refetch: refetchDates } = useAvailableDates(workshopId as string, currentDate, type);
  const availableDates = (availableDatesData?.availableDates || []) as []

  const { data: _isSlotAvailableData, refetch: checkAvailability } = useCheckSlotAvailability(selectedSlot?._id || "");

  useSaveSlotId();

  useEffect(() => {
    if (selectedDate) {
      refetchSlots();
    }
  }, [selectedDate, refetchSlots]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => addMonths(prev, 1));
  };

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setOverlappingServiceInfo(null);
  }, []);

  const handleSlotSelection = useCallback((slot: WorkshopSlot) => {
    setSelectedSlot(slot);
    setOverlappingServiceInfo(null);
  }, []);

  const handleBookingClick = async () => {
    if (!selectedDate || !selectedSlot) return;

    try {
      // await saveSlotId.mutateAsync(selectedSlot._id)
      const { data } = await checkAvailability();
      const isAvailable = data?.isSlotAvailable || false;
      if (!isAvailable) {
        errorToast("Slot became unavailable");
        setOverlappingServiceInfo("This slot is no longer available. Please choose another time.");
        refetchSlots();
        return;
      }
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error(error)
      errorToast("Error checking slot availability");
    }
  };

  const bookingDetails = useMemo(() => {
    if (!selectedDate || !selectedSlot) return null;
    const prices: Record<string, number> = { basic: 1500, interim: 5000, full: 7000 };
    return {
      date: selectedDate,
      time: selectedSlot.startTime,
      type,
      duration: serviceDuration,
      price: prices[type] || 1500,
    };
  }, [selectedDate, selectedSlot, type, serviceDuration]);

  const handleSubmit = async (finalAmount: number, gstAmount: number) => {
    if (!selectedDate || !selectedSlot || !customer?.id || !workshopId) return;

    try {
      const newBooking: BookSlot = {
        date: selectedDate,
        time: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        customerId: customer.id,
        workshopId,
        type,
        duration: serviceDuration,
        price: bookingDetails?.price || 1500,
        amount: finalAmount,
        gst: gstAmount,
        slotId: selectedSlot._id
      };

      try {
        await bookSlot.mutateAsync(newBooking);
        successToast("Booking confirmed!");
        setBookingSubmitted(true);
        setIsConfirmationModalOpen(true);
      } catch (error: any) {
        errorToast(error.message || "Something went wrong")
      }

      setTimeout(() => {
        setSelectedSlot(null);
        setSelectedDate(null);
        setBookingSubmitted(false);
        setOverlappingServiceInfo(null);
        setIsPaymentModalOpen(false);
        refetchSlots();
        refetchDates();
      }, 3000);
    } catch (error) {
      errorToast("Booking failed");
      setIsFailedModalOpen(true);
      setIsPaymentModalOpen(false);
    }
  };

  const generateDaysArray = useMemo(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
    const startingDayIndex = getDay(firstDayOfMonth);
    const prefixDays = Array(startingDayIndex).fill(null);
    return [...prefixDays, ...daysInMonth];
  }, [currentDate]);

  const isPastDate = useCallback((date: Date) => {
    const today = new Date();
    return isBefore(date, addDays(today, -1));
  }, []);

  const groupSlotsByTimeOfDay = useMemo(() => {
    if (!workshopSlots.length) return { morning: [], afternoon: [] };
    return {
      morning: workshopSlots.filter((slot) => {
        const hour = parseInt(slot.startTime.split(":")[0], 10);
        return hour >= 8 && hour < 12;
      }),
      afternoon: workshopSlots.filter((slot) => {
        const hour = parseInt(slot.startTime.split(":")[0], 10);
        return hour >= 12 && hour < 19;
      }),
    };
  }, [workshopSlots]);

  const hasAvailability = useCallback(
    (date: Date) => {
      if (!date) return false;
      return availableDates.some((availableDate) => isSameDay(availableDate, date));
    },
    [availableDates]
  );

  const formatTimeDisplay = useCallback((time: string) => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHour = hours % 12 || 12;
      return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
    } catch {
      return time;
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-125 min-w-200">
      <div className="p-4 md:p-6 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold">
            Select Date ({type} service - {serviceDuration} hour{serviceDuration > 1 ? "s" : ""})
          </h2>
          <div className="flex items-center">
            <button 
              onClick={handlePrevMonth} 
              className="p-1 md:p-2 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous month"
            >
              <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="text-base md:text-lg font-medium mx-2 md:mx-4">{format(currentDate, "MMMM yyyy")}</span>
            <button 
              onClick={handleNextMonth} 
              className="p-1 md:p-2 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next month"
            >
              <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {isLoadingDates ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="ml-2">Loading calendar...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center font-medium text-gray-500 text-xs md:text-sm py-2">
                  {day}
                </div>
              ))}

              {generateDaysArray.map((day, index) => {
                const hasAvailable = day ? hasAvailability(day) : false;
                const isDisabled = day ? isPastDate(day) || !hasAvailable : true;
                const isSelected = day && selectedDate ? isSameDay(day, selectedDate) : false;

                return (
                  <button
                    key={index}
                    className={`
                      relative h-10 md:h-12 flex items-center justify-center rounded-lg text-sm md:text-base
                      ${!day ? "text-gray-300" : "cursor-pointer hover:bg-gray-50"}
                      ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                      ${isDisabled ? "text-gray-300 cursor-not-allowed" : ""}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                    onClick={() => day && !isDisabled && handleDateClick(day)}
                    disabled={isDisabled}
                    aria-label={day ? `Select ${format(day, "MMMM d, yyyy")}` : ""}
                    aria-pressed={isSelected}
                    aria-disabled={isDisabled}
                  >
                    {day && (
                      <>
                        <span>{format(day, "d")}</span>
                        {hasAvailable && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mt-4">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1 md:mr-2" />
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1 md:mr-2" />
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-1 md:mr-2" />
                <span>Not Available</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 md:p-6 lg:w-1/2">
        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
          {selectedDate ? `Select Time for ${format(selectedDate, "EEEE, MMMM d, yyyy")}` : "Select a date first"}
        </h2>

        {overlappingServiceInfo && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded mb-4 md:mb-6 text-sm md:text-base">
            {overlappingServiceInfo}
          </div>
        )}

        {selectedDate && (
          <>
            {isSlotsLoading ? (
              <div className="text-center py-8 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <p>Loading available slots...</p>
              </div>
            ) : workshopSlots.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 md:px-4 md:py-3 rounded mb-4 md:mb-6 text-sm md:text-base">
                No slots available for this date. Please select another date.
              </div>
            ) : (
              <>
                {groupSlotsByTimeOfDay.morning.length > 0 && (
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">Morning</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {groupSlotsByTimeOfDay.morning.map((slot) => (
                        <button
                          key={slot._id}
                          className={`
                            p-2 md:p-3 rounded-lg transition-colors text-center text-sm md:text-base
                            ${selectedSlot?._id === slot._id ? "bg-blue-500 text-white" : ""}
                            ${!slot.isAvailable ? "bg-red-100 text-red-800 cursor-not-allowed" : selectedSlot?._id !== slot._id ? "bg-gray-100 hover:bg-gray-200" : ""}
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                          `}
                          onClick={() => slot.isAvailable && handleSlotSelection(slot)}
                          disabled={!slot.isAvailable}
                          aria-label={`Book time slot at ${formatTimeDisplay(slot.startTime)}`}
                          aria-pressed={selectedSlot?._id === slot._id}
                          aria-disabled={!slot.isAvailable}
                        >
                          <div>{formatTimeDisplay(slot.startTime)}</div>
                          <div className="text-xs mt-1">
                            {!slot.isAvailable ? "Fully Booked" : `${serviceDuration} hour${serviceDuration > 1 ? "s" : ""}`}
                          </div>
                          {slot.currentBookings > 0 && slot.isAvailable && (
                            <div className="text-xs mt-1">{`${slot.currentBookings}/${slot.maxBookings} booked`}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {groupSlotsByTimeOfDay.afternoon.length > 0 && (
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">Afternoon</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {groupSlotsByTimeOfDay.afternoon.map((slot) => (
                        <button
                          key={slot._id}
                          className={`
                            p-2 md:p-3 rounded-lg transition-colors text-center text-sm md:text-base
                            ${selectedSlot?._id === slot._id ? "bg-blue-500 text-white" : ""}
                            ${!slot.isAvailable ? "bg-red-100 text-red-800 cursor-not-allowed" : selectedSlot?._id !== slot._id ? "bg-gray-100 hover:bg-gray-200" : ""}
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                          `}
                          onClick={() => slot.isAvailable && handleSlotSelection(slot)}
                          disabled={!slot.isAvailable}
                          aria-label={`Book time slot at ${formatTimeDisplay(slot.startTime)}`}
                          aria-pressed={selectedSlot?._id === slot._id}
                          aria-disabled={!slot.isAvailable}
                        >
                          <div>{formatTimeDisplay(slot.startTime)}</div>
                          <div className="text-xs mt-1">
                            {!slot.isAvailable ? "Fully Booked" : `${serviceDuration} hour${serviceDuration > 1 ? "s" : ""}`}
                          </div>
                          {slot.currentBookings > 0 && slot.isAvailable && (
                            <div className="text-xs mt-1">{`${slot.currentBookings}/${slot.maxBookings} booked`}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className={`
                    w-full p-3 rounded-lg text-white font-medium text-center transition-colors
                    ${selectedDate && selectedSlot ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  disabled={!selectedDate || !selectedSlot}
                  onClick={handleBookingClick}
                  aria-label={selectedSlot ? `Book ${type} service for ${serviceDuration} hour${serviceDuration > 1 ? "s" : ""}` : "Select a time slot"}
                >
                  {selectedSlot ? `Book ${type} Service (${serviceDuration} hour${serviceDuration > 1 ? "s" : ""})` : "Select a time slot"}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {bookingDetails && (
        <PaymentModal
          isPaymentModalOpen={isPaymentModalOpen}
          handleSubmit={handleSubmit}
          setIsPaymentModalOpen={setIsPaymentModalOpen}
          bookingDetails={bookingDetails}
          setIsConfirmationModalOpen={setIsConfirmationModalOpen}
          setIsFailedModalOpen={setIsFailedModalOpen}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        serviceName={type}
      />

      <FailedModal isOpen={isFailedModalOpen} onClose={() => setIsFailedModalOpen(false)} />
    </div>
  );
};

export default CalenderSection;
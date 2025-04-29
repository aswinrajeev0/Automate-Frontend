import React, { useState } from 'react';
import { Header } from '../../components/customer/Header';
import { Footer } from '../../components/customer/Footer';
import BookedSlots from '../../components/customer/slotBooking/BookedSlots';
import CalenderSection from '../../components/customer/slotBooking/CalenderSection';
import { useBookedSlots, useCancelSlot } from '../../hooks/customer/useSlotBooking';
import { useParams, useSearchParams } from 'react-router-dom';

const SlotBookingPage: React.FC = () => {
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  
  const { workshopId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  
  const { data, isLoading, error } = useBookedSlots(workshopId as string, type);
  
  const cancelBooking = useCancelSlot(workshopId as string, type)
  const onCancelBooking = (bookingId: string) => {
    const response = cancelBooking.mutateAsync(bookingId)
    console.log(response)
  }
  
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Book Your Appointment</h1>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex justify-center items-center w-full">
                <div className="text-center">
                  <p className="text-xl mb-4">Loading booking information...</p>
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Book Your Appointment</h1>
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
            <div className="text-center">
              <h2 className="text-2xl text-red-600 mb-4">Error loading booking information</h2>
              <p className="mb-6">
                {(error instanceof Error) ? error.message : 'An unexpected error occurred'}
              </p>
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Book Your Appointment</h1>
        {bookingSubmitted && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            Your booking has been successfully scheduled!
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row justify-center">
            {/* Calendar Section */}
            <CalenderSection 
              setBookingSubmitted={setBookingSubmitted} 
              bookedSlots={data?.bookings || []} 
            />
          </div>
          
          {/* Booked Slots Section */}
          <BookedSlots 
            bookedSlots={data?.bookings || []}
            onCancelBooking={onCancelBooking} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SlotBookingPage;
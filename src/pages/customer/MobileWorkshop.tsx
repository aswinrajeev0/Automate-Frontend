import React, { useState } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import * as Yup from "yup"
import { Button } from "../../components/ui/Button"
import { Card, CardContent } from "../../components/ui/Card"
import { Input } from "../../components/ui/Input"
import { Label } from "../../components/ui/Label"
import { Header } from '../../components/customer/Header';
import { Footer } from '../../components/customer/Footer';
import MapSelection from '../../components/customer/carLift/MapSelection';
import LocationComponent from '../../components/map/LocationComponent';
import SavedAddress from '../../components/customer/carLift/SavedAddress';
import { useFormik } from 'formik';
import { useMobileWorkshopRequest } from '../../hooks/customer/useServiceRequests';
import { useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/customer/carLift/ConfirmationModal';
import { Textarea } from '../../components/ui/Textarea';
import FailedModal from '../../components/customer/carLift/FailedModal';
import PaymentModal from '../../components/customer/payment/PaymentModal';

// Define types
interface FormData {
    name: string;
    mobile: string;
    vehicleNumber: string;
    carType: string;
    brand: string;
    location: string;
    description: string;
    notes?: string
}

type LocationOption = 'current' | 'saved' | 'map';

const MobileWorkshop: React.FC = () => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showCarTypes, setShowCarTypes] = useState<boolean>(false);
    const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
    const [selectedLocationOption, setSelectedLocationOption] = useState<LocationOption>('current');
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [showFailure, setShowFailure] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>(null);
    const { workshopId } = useParams()
    const mobileWorkshopRequest = useMobileWorkshopRequest()

    // Define default service pricing
    const [bookingDetails, _setBookingDetails] = useState({
        date: new Date(),
        time: "ASAP",
        type: "Mobile Workshop",
        duration: 2,
        price: 250
    });

    const carTypes: string[] = [
        'Sedan', 'SUV', 'Hatchback', 'Pickup', 'Minivan', 'Convertible', 'Coupe'
    ];

    const validationSchema = Yup.object({
        name: Yup.string().trim().required("Name is required"),
        mobile: Yup.string()
            .trim()
            .required("Mobile number is required")
            .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
        vehicleNumber: Yup.string().trim().required("Vehicle number is required"),
        carType: Yup.string().trim().required("Car type is required"),
        brand: Yup.string().trim().required("Car brand is required"),
        location: Yup.string().trim().required("Location is required"),
        description: Yup.string().trim().required("Description is required"),
    })

    const formik = useFormik<FormData>({
        initialValues: {
            name: "",
            mobile: "",
            vehicleNumber: "",
            carType: "",
            brand: "",
            location: "",
            description: "",
            notes: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            setSubmitting(true);
            
            const data = {
                name: values.name,
                workshopId: workshopId as string,
                mobile: values.mobile,
                vehicleNo: values.vehicleNumber,
                carType: values.carType,
                carBrand: values.brand,
                location: values.location,
                type: "mobile-workshop",
                description: values.description,
                notes: values.notes
            };
            
            // Store form data for later submission after payment
            setFormData(data);
            
            // Open payment modal instead of submitting directly
            setIsPaymentModalOpen(true);
            setSubmitting(false);
        },
    });

    // Handle payment completion and submit form data
    const handlePaymentComplete = async (finalAmount: number, gstAmount: number) => {
        try {
            // Add payment details to the request
            const dataWithPayment = {
                ...formData,
                paymentAmount: finalAmount,
                gstAmount: gstAmount,
                paymentStatus: 'completed'
            };
            
            const response = await mobileWorkshopRequest.mutateAsync(dataWithPayment);
            
            if (response.status === 201) {
                setShowConfirmation(true);
            } else {
                setShowFailure(true);
                setErrorMessage("Service request failed after payment");
            }
        } catch (error: any) {
            setErrorMessage(error?.response?.data || "Something went wrong after payment");
            setShowFailure(true);
        }
    };

    const handleLocationSelect = (address: string): void => {
        formik.setFieldValue("location", address)
        setShowLocationModal(false)
    }

    const handleLocationOptionChange = (option: LocationOption): void => {
        setSelectedLocationOption(option);
    };

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card className="shadow-lg">
                    <CardContent className="p-6 sm:p-8">
                        <>
                            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Request Mobile Workshop Service</h1>

                            <form onSubmit={formik.handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name and Mobile */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-lg font-medium text-blue-700">
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your full name"
                                            className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mobile" className="text-lg font-medium text-blue-700">
                                            Mobile Number
                                        </Label>
                                        <Input
                                            type="tel"
                                            id="mobile"
                                            name="mobile"
                                            value={formik.values.mobile}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your mobile number"
                                            className={formik.touched.mobile && formik.errors.mobile ? "border-red-500" : ""}
                                        />
                                        {formik.touched.mobile && formik.errors.mobile && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.mobile}</p>
                                        )}
                                    </div>

                                    {/* Vehicle Number and Car Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicleNumber" className="text-lg font-medium text-blue-700">
                                            Vehicle Number
                                        </Label>
                                        <Input
                                            id="vehicleNumber"
                                            name="vehicleNumber"
                                            value={formik.values.vehicleNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your vehicle number"
                                            className={formik.touched.vehicleNumber && formik.errors.vehicleNumber ? "border-red-500" : ""}
                                        />
                                        {formik.touched.vehicleNumber && formik.errors.vehicleNumber && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.vehicleNumber}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2 relative">
                                        <Label htmlFor="carType" className="text-lg font-medium text-blue-700">
                                            Car Type
                                        </Label>
                                        <div
                                            className={`w-full p-3 border rounded-lg flex justify-between items-center cursor-pointer bg-white ${formik.touched.carType && formik.errors.carType ? "border-red-500" : "border-gray-300"
                                                }`}
                                            onClick={() => setShowCarTypes(!showCarTypes)}
                                        >
                                            <span className={formik.values.carType ? "text-gray-900" : "text-gray-400"}>
                                                {formik.values.carType || "Select your car type"}
                                            </span>
                                            <ChevronDown size={20} className="text-gray-500" />
                                        </div>
                                        {formik.touched.carType && formik.errors.carType && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.carType}</p>
                                        )}

                                        {showCarTypes && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                                                {carTypes.map((type) => (
                                                    <div
                                                        key={type}
                                                        className="p-3 hover:bg-blue-50 cursor-pointer"
                                                        onClick={() => {
                                                            formik.setFieldValue("carType", type)
                                                            setShowCarTypes(false)
                                                        }}
                                                    >
                                                        {type}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Brand and Location */}
                                    <div className="space-y-2">
                                        <Label htmlFor="brand" className="text-lg font-medium text-blue-700">
                                            Car Brand
                                        </Label>
                                        <Input
                                            id="brand"
                                            name="brand"
                                            value={formik.values.brand}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter your car brand"
                                            className={formik.touched.brand && formik.errors.brand ? "border-red-500" : ""}
                                        />
                                        {formik.touched.brand && formik.errors.brand && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.brand}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-lg font-medium text-blue-700">
                                            Location
                                        </Label>
                                        <div
                                            className={`w-full p-3 border rounded-lg flex items-center bg-white cursor-pointer ${formik.touched.location && formik.errors.location ? "border-red-500" : "border-gray-300"
                                                }`}
                                            onClick={() => setShowLocationModal(true)}
                                        >
                                            <MapPin size={20} className="text-red-500 mr-2 flex-shrink-0" />
                                            <span className="truncate">{formik.values.location || "Select your location"}</span>
                                            <span className="ml-auto text-xs text-blue-600">Change</span>
                                        </div>
                                        {formik.touched.location && formik.errors.location && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.location}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-lg font-medium text-blue-700">
                                            Description
                                        </Label>
                                        <Textarea
                                            id='description'
                                            name='description'
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder='Enter the description of the situation'
                                            className={formik.touched.description && formik.errors.description ? "border-red-500" : ""}
                                        />
                                        {formik.touched.description && formik.errors.description && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-lg font-medium text-blue-700">
                                            Notes
                                        </Label>
                                        <Textarea
                                            id='notes'
                                            name='notes'
                                            value={formik.values.notes}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder='Please provide any notes to the mechanic'
                                            className={formik.touched.notes && formik.errors.notes ? "border-red-500" : ""}
                                        />
                                        {formik.touched.notes && formik.errors.notes && (
                                            <p className="text-red-500 text-sm mt-1">{formik.errors.notes}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-4 px-6 text-lg font-semibold ${submitting ? "bg-yellow-400" : "bg-yellow-500 hover:bg-yellow-600"
                                        }`}
                                >
                                    {submitting ? "Processing..." : "Request Mobile Workshop Service"}
                                </Button>
                            </form>
                        </>
                    </CardContent>
                </Card>
            </div>

            {/* Location Selection Modal */}
            {showLocationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-xl font-bold">Select Location</h3>
                            <button onClick={() => setShowLocationModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Location Selection Tabs */}
                            <div className="flex border-b mb-4">
                                <button
                                    className={`px-4 py-2 font-medium ${selectedLocationOption === "current" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                    onClick={() => handleLocationOptionChange("current")}
                                >
                                    Current Location
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium ${selectedLocationOption === "saved" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                    onClick={() => handleLocationOptionChange("saved")}
                                >
                                    Saved Addresses
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium ${selectedLocationOption === "map" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                    onClick={() => handleLocationOptionChange("map")}
                                >
                                    Select on Map
                                </button>
                            </div>

                            {/* Current Location */}
                            {selectedLocationOption === "current" && (
                                <LocationComponent handleLocationSelect={handleLocationSelect} />
                            )}

                            {/* Saved Addresses */}
                            {selectedLocationOption === "saved" && <SavedAddress handleLocationSelect={handleLocationSelect} />}

                            {/* Map Selection */}
                            {selectedLocationOption === "map" && <MapSelection handleLocationSelect={handleLocationSelect} />}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            <PaymentModal
                isPaymentModalOpen={isPaymentModalOpen}
                setIsPaymentModalOpen={setIsPaymentModalOpen}
                bookingDetails={bookingDetails}
                handleSubmit={handlePaymentComplete}
                setIsConfirmationModalOpen={setShowConfirmation}
                setIsFailedModalOpen={setShowFailure}
            />

            <Footer />
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => {
                    setShowConfirmation(false);
                    formik.resetForm();
                }}
                serviceName='mobile workshop'
            />
            <FailedModal
                isOpen={showFailure}
                onClose={() => setShowFailure(false)}
                errorMessage={errorMessage}
            />
        </>
    );
};

export default MobileWorkshop;
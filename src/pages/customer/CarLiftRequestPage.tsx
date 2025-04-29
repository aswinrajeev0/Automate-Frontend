import React, { useState, ChangeEvent, useEffect } from 'react';
import { MapPin, Camera, ChevronDown, X } from 'lucide-react';
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
import { uploadImage } from '../../services/cloudinary/cloudinary';
import { useCarLiftRequest } from '../../hooks/customer/useServiceRequests';
import { useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/customer/carLift/ConfirmationModal';
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
    image: File | null;
}

interface SavedAddress {
    id: number;
    name: string;
    address: string;
}

type LocationOption = 'current' | 'saved' | 'map';

const CarLiftServiceForm: React.FC = () => {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showCarTypes, setShowCarTypes] = useState<boolean>(false);
    const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
    const [selectedLocationOption, setSelectedLocationOption] = useState<LocationOption>('current');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [showFailure, setShowFailure] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<any>(null);
    const { workshopId } = useParams();
    const carLiftRequest = useCarLiftRequest();

    const basePriceForCarLift = 999;

    const carTypes: string[] = [
        'Sedan', 'SUV', 'Hatchback', 'Pickup', 'Minivan', 'Convertible', 'Coupe'
    ];

    const bookingDetails = {
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        type: "Car Lift",
        duration: 1,
        price: basePriceForCarLift
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        mobile: Yup.string()
            .required("Mobile number is required")
            .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
        vehicleNumber: Yup.string().required("Vehicle number is required"),
        carType: Yup.string().required("Car type is required"),
        brand: Yup.string().required("Car brand is required"),
        location: Yup.string().required("Location is required"),
    });

    const formik = useFormik<FormData>({
        initialValues: {
            name: "",
            mobile: "",
            vehicleNumber: "",
            carType: "",
            brand: "",
            location: "",
            image: null,
        },
        validationSchema,
        onSubmit: async (values) => {
            setSubmitting(true);
            
            try {
                const imageUrl = await uploadImage(values.image);
                
                const data = {
                    name: values.name,
                    image: imageUrl || "",
                    workshopId: workshopId as string,
                    mobile: values.mobile,
                    vehicleNo: values.vehicleNumber,
                    carType: values.carType,
                    carBrand: values.brand,
                    location: values.location,
                    type: "car-lift",
                };
                
                setFormData(data);
                
                setIsPaymentModalOpen(true);
            } catch (error) {
                console.error("Error preparing form submission:", error);
                setErrorMessage("Failed to process your request. Please try again.");
                setShowFailure(true);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleSubmitAfterPayment = async (finalAmount: number, gstAmount: number) => {
        try {
            const dataWithPayment = {
                ...formData,
                amount: finalAmount,
                gst: gstAmount
            };
            
            const response = await carLiftRequest.mutateAsync(dataWithPayment);
            if (response.status === 201) {
                setShowConfirmation(true);
            } else {
                setErrorMessage(response.data.message || "Something went wrong");
                setShowFailure(true);
            }
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message || "Something went wrong");
            setShowFailure(true);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            formik.setFieldValue("image", file);

            // Create a preview URL for the image
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, []);

    const handleLocationSelect = (address: string): void => {
        formik.setFieldValue("location", address);
        setShowLocationModal(false);
    };

    const handleLocationOptionChange = (option: LocationOption): void => {
        setSelectedLocationOption(option);
    };

    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card className="shadow-lg">
                    <CardContent className="p-4 sm:p-6 md:p-8">
                        <>
                            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">Request Car Lift Service</h1>

                            <form onSubmit={formik.handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name and Mobile */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-md sm:text-lg font-medium text-blue-700">
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
                                        <Label htmlFor="mobile" className="text-md sm:text-lg font-medium text-blue-700">
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
                                        <Label htmlFor="vehicleNumber" className="text-md sm:text-lg font-medium text-blue-700">
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
                                        <Label htmlFor="carType" className="text-md sm:text-lg font-medium text-blue-700">
                                            Car Type
                                        </Label>
                                        <div
                                            className={`w-full p-3 border rounded-lg flex justify-between items-center cursor-pointer bg-white ${
                                                formik.touched.carType && formik.errors.carType ? "border-red-500" : "border-gray-300"
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
                                                            formik.setFieldValue("carType", type);
                                                            setShowCarTypes(false);
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
                                        <Label htmlFor="brand" className="text-md sm:text-lg font-medium text-blue-700">
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
                                        <Label htmlFor="location" className="text-md sm:text-lg font-medium text-blue-700">
                                            Location
                                        </Label>
                                        <div
                                            className={`w-full p-3 border rounded-lg flex items-center bg-white cursor-pointer ${
                                                formik.touched.location && formik.errors.location ? "border-red-500" : "border-gray-300"
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
                                </div>

                                {/* Upload Image */}
                                <div className="mt-6">
                                    <p className="block text-md sm:text-lg font-medium text-blue-700 mb-2">Upload Image of Your Car</p>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 md:p-8 text-center">
                                        {imagePreview ? (
                                            <div className="flex flex-col items-center">
                                                <div className="relative mb-4 w-full max-w-xs">
                                                    <img
                                                        src={imagePreview || "/placeholder.svg"}
                                                        alt="Car preview"
                                                        className="rounded-lg object-cover w-full h-auto max-h-48"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImagePreview(null);
                                                            formik.setFieldValue("image", null);
                                                        }}
                                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                                    >
                                                        <X size={16} className="text-gray-700" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-green-600 mb-2">{formik.values.image?.name}</p>
                                                <label
                                                    htmlFor="car-image"
                                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition cursor-pointer text-sm"
                                                >
                                                    Change Image
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center">
                                                <Camera size={40} className="text-gray-400 mb-3" />
                                                <p className="text-gray-600 mb-2 text-sm sm:text-base">Drag and drop an image here or click to browse</p>
                                                <p className="text-gray-400 text-xs sm:text-sm">JPG, PNG or JPEG (max. 5MB)</p>
                                                <label
                                                    htmlFor="car-image"
                                                    className="mt-4 px-4 sm:px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition cursor-pointer text-sm sm:text-base"
                                                >
                                                    Browse Files
                                                </label>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="car-image"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                {/* Price Information */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-2">Service Price</h3>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span>Car Lift Service:</span>
                                        <span>₹{basePriceForCarLift.toLocaleString()}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        * Final price may vary based on distance and vehicle type
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 text-md sm:text-lg font-semibold ${
                                        submitting ? "bg-yellow-400" : "bg-yellow-500 hover:bg-yellow-600"
                                    }`}
                                >
                                    {submitting ? "Processing..." : "Proceed to Payment"}
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
                            <h3 className="text-lg sm:text-xl font-bold">Select Location</h3>
                            <button onClick={() => setShowLocationModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Location Selection Tabs */}
                            <div className="flex border-b mb-4 overflow-x-auto">
                                <button
                                    className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap ${selectedLocationOption === "current" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                    onClick={() => handleLocationOptionChange("current")}
                                >
                                    Current Location
                                </button>
                                <button
                                    className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap ${selectedLocationOption === "saved" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                                    onClick={() => handleLocationOptionChange("saved")}
                                >
                                    Saved Addresses
                                </button>
                                <button
                                    className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap ${selectedLocationOption === "map" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
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
                handleSubmit={handleSubmitAfterPayment}
                setIsPaymentModalOpen={setIsPaymentModalOpen}
                bookingDetails={bookingDetails}
                setIsConfirmationModalOpen={setShowConfirmation}
                setIsFailedModalOpen={setShowFailure}
            />

            {/* Confirmation and Failed Modals */}
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => {
                    setShowConfirmation(false);
                    formik.resetForm();
                    setImagePreview(null);
                }}
                serviceName='car lift'
            />
            <FailedModal
                isOpen={showFailure}
                onClose={() => setShowFailure(false)}
                errorMessage={errorMessage}
            />
            
            <Footer />
        </>
    );
};

export default CarLiftServiceForm;
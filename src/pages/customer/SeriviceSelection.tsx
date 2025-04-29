import { useState } from "react";
import { Clock, Check, ArrowRight, Shield, Calendar, Wrench } from "lucide-react";
import { Header } from "../../components/customer/Header";
import { Footer } from "../../components/customer/Footer";
import { useNavigate, useParams } from "react-router-dom";

const ServiceSelectionPage = () => {
    const [selectedService, setSelectedService] = useState<number | null>(null);

    const navigate = useNavigate();
    const {workshopId} = useParams()

    const services = [
        {
            id: 1,
            title: "Basic Service",
            subtitle: "Oil Change, Filter Replacement, Inspection",
            duration: "1 Hour",
            price: "₹1,500",
            features: [
                "Oil and filter change",
                "Fluid level check",
                "Tire pressure check",
                "General inspection"
            ],
            color: "blue",
            icon: <Wrench size={20} />,
            path: `/request-service/slot-booking/${workshopId}?type=basic`
        },
        {
            id: 2,
            title: "Interim/Minor Service",
            subtitle: "Basic Maintenance + Additional Checks",
            duration: "2 Hours",
            price: "₹5,000",
            features: [
                "Basic service tasks",
                "Air filter replacement",
                "Brake check",
                "Battery check"
            ],
            color: "indigo",
            icon: <Wrench size={20} />,
            path: `/request-service/slot-booking/${workshopId}?type=interim`
        },
        {
            id: 3,
            title: "Full/Major Service",
            subtitle: "Comprehensive Vehicle Maintenance",
            duration: "3 Hours",
            price: "₹7,000",
            features: [
                "All minor service tasks",
                "Coolant flush",
                "Spark plug replacement",
                "Suspension and steering check"
            ],
            color: "purple",
            icon: <Wrench size={20} />,
            path: `/request-service/slot-booking/${workshopId}?type=full`
        }
    ];

    return (
        <>
        <Header />
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-4">Select a Service Package</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose the service that best fits your vehicle's needs. All services are performed by certified mechanics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`bg-white rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${selectedService === service.id
                                    ? "border-yellow-400 shadow-md"
                                    : "border-gray-100"
                                }`}
                            onClick={() => setSelectedService(service.id)}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">{service.title}</h2>
                                        <p className="text-sm text-gray-500">{service.subtitle}</p>
                                    </div>
                                    <div className={`flex items-center justify-center rounded-full p-3 bg-${service.color}-100 text-${service.color}-600`}>
                                        {service.icon}
                                    </div>
                                </div>

                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <Check size={16} className="text-green-500 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex items-center justify-center rounded-full bg-blue-100 text-blue-600 p-2">
                                        <Clock size={16} />
                                    </div>
                                    <span className="text-sm font-medium">{service.duration}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-2xl font-bold text-gray-800">{service.price}</div>
                                    <button onClick={() => navigate(service.path)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        Book a slot <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Satisfaction Guaranteed</h3>
                                <p className="text-sm text-gray-600">All our services come with a satisfaction guarantee</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Flexible Scheduling</h3>
                                <p className="text-sm text-gray-600">Book your service at a time that works for you</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                                <Wrench size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Certified Mechanics</h3>
                                <p className="text-sm text-gray-600">All services performed by qualified professionals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServiceSelectionPage;
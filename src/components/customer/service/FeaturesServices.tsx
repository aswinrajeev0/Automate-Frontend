import { ArrowRight, Car, Truck, Wrench } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const FeaturedServices: React.FC = () => {

    const navigate = useNavigate()
    const {workshopId} = useParams()

    const services = [
        {
            id: 1,
            title: "Request Service",
            description: "Book a comprehensive vehicle service with our expert mechanics",
            image: "../car-service.jpg",
            icon: <Wrench size={24} />,
            features: ["Full diagnostics", "Expert mechanics", "Transparent pricing"],
            cta: "Book Now",
            path: "/request-service/service"
        },
        {
            id: 2,
            title: "Car Lifting",
            description: "Professional car lifting services for maintenance and repairs",
            image: "../car-lift.jpg",
            icon: <Car size={24} />,
            features: ["Modern equipment", "Safety certified", "Any vehicle type"],
            cta: "Learn More",
            path: "/request-service/car-lift"
        },
        {
            id: 3,
            title: "Mobile Workshop",
            description: "We come to you - roadside assistance and on-location repairs",
            image: "../mobile-workshop.jpg",
            icon: <Truck size={24} />,
            features: ["24/7 availability", "Fast response", "Fully-equipped vans"],
            cta: "Request Help",
            path: "/request-service/mobile-workshop"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service) => (
                <div
                    key={service.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]"
                >
                    <div className="relative h-52 bg-gray-100">
                        <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-cyan-600 p-2 rounded-full">
                            {service.icon}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <ul className="mb-6">
                            {service.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 mb-2">
                                    <div className="text-yellow-500">•</div>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => navigate(`${service.path}/${workshopId}`)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
                            {service.cta}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FeaturedServices
import { Clock, Shield, Star, Wrench } from "lucide-react";
import React from "react";

const ChooseUs: React.FC = () => {
    return (
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg text-center">
                    <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                        <Wrench size={24} className="text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Expert Technicians</h3>
                    <p className="text-sm text-gray-600">Our certified mechanics have years of experience</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                    <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                        <Clock size={24} className="text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Fast Service</h3>
                    <p className="text-sm text-gray-600">Quick turnaround on all automotive services</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                    <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                        <Star size={24} className="text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
                    <p className="text-sm text-gray-600">We stand behind all our work with satisfaction guarantee</p>
                </div>
                <div className="bg-white p-6 rounded-lg text-center">
                    <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                        <Shield size={24} className="text-yellow-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Warranty Protection</h3>
                    <p className="text-sm text-gray-600">All services come with comprehensive warranty</p>
                </div>
            </div>
        </div>
    )
}

export default ChooseUs
import React from "react";

const CtaSection: React.FC = () => {
    return (
        <div className="bg-yellow-400 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-800 mb-6 max-w-2xl mx-auto">
                Contact us today to schedule your service appointment or learn more about how we can help with your automotive needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-black text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                    Schedule Service
                </button>
                <button className="bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                    Contact Us
                </button>
            </div>
        </div>
    )
}

export default CtaSection
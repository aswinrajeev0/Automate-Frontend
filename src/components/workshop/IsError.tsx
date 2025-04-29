import React from "react";

const IsError: React.FC<{content: string}> = ({ content }) => {
    return (
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm h-[calc(100vh-80px)] flex flex-col items-center justify-center">
            <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded mb-4 max-w-md">
                <h3 className="text-red-700 font-medium mb-2">Unable to load requests</h3>
                <p className="text-red-600">There was an error while fetching {content}. Please try again later.</p>
            </div>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                Retry
            </button>
        </div>
    )
}

export default IsError;
import React from "react";

const IsLoading: React.FC<{content: string}> = ({content}) => {
    return (
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg shadow-sm h-[calc(100vh-80px)] flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-red-600 animate-spin mb-4"></div>
            <p className="text-gray-700 font-medium">Loading {content}...</p>
        </div>
    )
}

export default IsLoading
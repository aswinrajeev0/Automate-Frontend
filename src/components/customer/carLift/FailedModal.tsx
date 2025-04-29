import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface FailedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  errorMessage?: string;
}

const FailedModal: React.FC<FailedModalProps> = ({ 
  isOpen, 
  onClose, 
  onRetry,
  errorMessage = "We couldn't process your request at this time." 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-end p-2">
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <div className="px-6 pb-6 pt-2 text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Request Failed
          </h2>
          
          <p className="text-gray-600 mb-4">
            {errorMessage}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Please try again or contact our support team for assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition flex-1 flex items-center justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className={`py-3 px-4 ${onRetry ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-red-500 hover:bg-red-600 text-white'} font-medium rounded-lg transition flex-1`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FailedModal;
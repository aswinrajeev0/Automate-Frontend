import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  serviceName: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, email, serviceName }) => {
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
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Request Submitted!
          </h2>
          
          <p className="text-gray-600 mb-4">
            Your {serviceName} service request has been successfully submitted.
            {email ? ` You will receive a confirmation email at ${email} shortly.` : ' You will receive an email confirmation shortly.'}
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Our team will contact you within 24 hours to confirm your booking details.
          </p>
          
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
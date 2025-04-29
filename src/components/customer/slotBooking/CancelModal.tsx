import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../ui/alert-dialog';

interface CancelConfirmationModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    onConfirm: (id: string) => void;
    id: string
}

const CancelConfirmationModal: React.FC<CancelConfirmationModalProps> = ({
    isOpen, 
    setIsOpen,
    onConfirm,
    id
}) => {

  const handleCancel = () => {

    setIsOpen(false);
  };

  const handleConfirm = () => {
    onConfirm(id)
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Cancel Your booking?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500">
              Are you sure you want to cancel your booking?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex space-x-2">
            <AlertDialogCancel 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              onClick={handleCancel}
            >
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirm}
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CancelConfirmationModal;
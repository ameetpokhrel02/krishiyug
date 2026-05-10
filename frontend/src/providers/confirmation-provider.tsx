import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ConfirmationDialog } from '@/components/dialogs/confirmation-dialog';
import type { ConfirmationType } from '@/components/dialogs/confirmation-dialog';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);

  const confirm = (opts: ConfirmationOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setOptions(null);
  };

  const handleConfirm = () => {
    options?.onConfirm();
    handleClose();
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      <ConfirmationDialog 
        isOpen={isOpen} 
        onClose={handleClose} 
        options={options ? { ...options, onConfirm: handleConfirm } : null} 
      />
    </ConfirmationContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmationProvider');
  }
  return context;
};

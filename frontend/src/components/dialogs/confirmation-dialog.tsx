import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type ConfirmationType = 'delete' | 'logout' | 'approve' | 'reject' | 'warning' | 'ai';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  options 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  options: ConfirmationOptions | null 
}) => {
  if (!options) return null;

  const getStyles = () => {
    switch (options.type) {
      case 'delete': return 'bg-danger text-white hover:bg-danger/90';
      case 'approve': return 'bg-success text-white hover:bg-success/90';
      case 'reject': return 'bg-danger text-white hover:bg-danger/90';
      case 'ai': return 'bg-primary text-white hover:bg-primary/90';
      default: return 'bg-primary text-white hover:bg-primary/90';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {options.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={options.onCancel}>
            {options.cancelText || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={options.onConfirm}
            className={getStyles()}
          >
            {options.confirmText || 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

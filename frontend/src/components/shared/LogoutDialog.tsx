import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  theme?: 'emerald' | 'indigo';
}

export const LogoutDialog = ({ open, onClose, theme = 'emerald' }: LogoutDialogProps) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Small delay for UX
    await new Promise(r => setTimeout(r, 400));
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('krishiyug_lang');
    onClose();
    navigate(PATHS.HOME);
  };

  const accentColor = theme === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">
                Log Out?
              </h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                You will be signed out of your account and returned to the home page.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoggingOut}
                  className="flex-1 h-12 rounded-2xl border-slate-200 text-slate-700 font-black uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200"
                >
                  {isLoggingOut ? 'Logging out...' : 'Yes, Log Out'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

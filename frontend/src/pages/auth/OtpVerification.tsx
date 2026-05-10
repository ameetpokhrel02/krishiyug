import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(PATHS.DASHBOARD.FARMER);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="mb-8">
        <Link to={PATHS.AUTH.ROLE_SELECTION} className="text-sm text-slate-500 hover:text-indigo-600 mb-6 inline-block transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-3xl font-heading font-bold text-indigo-950 mb-2">
          Verify Phone Number
        </h1>
        <p className="text-slate-500">
          We've sent a 6-digit verification code to your phone.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-900 text-white rounded-xl font-medium hover:bg-indigo-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900 transition-all shadow-md mt-6"
        >
          Verify OTP
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Didn't receive the code?{' '}
        <button className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors focus:outline-none">
          Resend
        </button>
      </div>
    </motion.div>
  );
};

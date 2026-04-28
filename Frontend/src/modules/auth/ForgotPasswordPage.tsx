import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button, Input } from '../../components/ui';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Reset Password</h2>
        <p className="mt-2 text-sm font-medium text-[var(--foreground-muted)]">
          {sent ? "Check your email for reset instructions" : "Enter your email to receive a password reset link"}
        </p>
      </div>

      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[var(--foreground-muted)] uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
              <Input 
                type="email" 
                required 
                className="pl-10" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11" loading={loading}>
            <Send className="w-4 h-4 mr-2" /> Send Link
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <Button onClick={() => setSent(false)} variant="outline" className="w-full h-11 border-[var(--border-main)] text-[var(--foreground-secondary)] bg-[var(--surface)]">
            Try another email
          </Button>
        </div>
      )}

      <div className="relative">
         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-color)]"></div></div>
         <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-[var(--surface)] px-2 text-[var(--foreground-muted)] font-bold tracking-tighter">Remembered your password?</span></div>
      </div>

      <Link to="/login">
        <Button variant="outline" className="w-full h-11 border-[var(--border-main)] text-[var(--foreground-secondary)] bg-[var(--surface)] hover:bg-[var(--background-secondary)] group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to login
        </Button>
      </Link>
    </div>
  );
};

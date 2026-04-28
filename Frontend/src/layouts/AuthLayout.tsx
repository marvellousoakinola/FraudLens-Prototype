import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { PageTransition } from '../components/PageTransition';


export const AuthLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--background-secondary)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center w-full">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <img src="/src/assets/images/fraudlenslogo.png" alt="Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform logo-bold" />
          <span className="font-bold text-2xl tracking-tight text-[var(--foreground)]">FraudLens</span>
        </Link>
        <div className="bg-[var(--surface)] py-8 px-4 shadow-xl border border-border-main rounded-2xl sm:px-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          Secure authentication powered by FraudLens Security
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy loading or direct imports for pages
// I'll create these files next
import { LandingPage } from '../modules/public/LandingPage';
import { ResultsPage } from '../modules/public/ResultsPage';
import { LoginPage } from '../modules/auth/LoginPage';
import { SignupPage } from '../modules/auth/SignupPage';
import { ForgotPasswordPage } from '../modules/auth/ForgotPasswordPage';
import { DashboardPage } from '../modules/private/DashboardPage';
import { HistoryPage } from '../modules/private/HistoryPage';
import { ScanCenterPage } from '../modules/private/ScanCenterPage';
import { LiveActivityPage } from '../modules/private/LiveActivityPage';
import { ThreatReportsPage } from '../modules/private/ThreatReportsPage';
import { ThreatIntelligencePage } from '../modules/private/ThreatIntelligencePage';
import { AnalyticsPage } from '../modules/private/AnalyticsPage';
import { AIInsightsPage } from '../modules/private/AIInsightsPage';
import { ProfilePage } from '../modules/private/settings/ProfilePage';
import { SecurityPage } from '../modules/private/settings/SecurityPage';
import { NotificationsPage } from '../modules/private/settings/NotificationsPage';
import { AppearancePage } from '../modules/private/settings/AppearancePage';
import { APIAccessPage } from '../modules/private/settings/APIAccessPage';
import { DocumentationPage } from '../modules/private/settings/DocumentationPage';
import { BillingPage } from '../modules/private/settings/BillingPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Private Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/results/:scanId" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/scan" element={<ScanCenterPage />} />
        <Route path="/live-activity" element={<LiveActivityPage />} />
        
        <Route path="/reports/threats" element={<ThreatReportsPage />} />
        <Route path="/threat-intel" element={<ThreatIntelligencePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
        
        <Route path="/settings/profile" element={<ProfilePage />} />
        <Route path="/settings/security" element={<SecurityPage />} />
        <Route path="/settings/notifications" element={<NotificationsPage />} />
        <Route path="/settings/appearance" element={<AppearancePage />} />
        <Route path="/settings/api" element={<APIAccessPage />} />
        <Route path="/settings/documentation" element={<DocumentationPage />} />
        <Route path="/settings/billing" element={<BillingPage />} />

        <Route path="/alerts" element={<div className="text-white">Alerts Module (Coming Soon)</div>} />
        <Route path="/settings" element={<div className="text-white">Account Settings (Coming Soon)</div>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

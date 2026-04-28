# FraudLens

<div align="center">
  <h3>Next-generation cybersecurity platform for fraud detection and link analysis</h3>
</div>

FraudLens is an advanced cybersecurity application that enables users to scan, detect, and analyze potential security threats, fraudulent links, and malicious IP addresses. Leveraging artificial intelligence and a fully modernized dashboard, FraudLens provides real-time traffic monitoring, deep threat intelligence, and predictive security insights. 

## 🚀 Key Features

### Core Analysis & Intelligence
- **Scan Center**: Initiate deep scans on suspicious URLs, domains, and IP addresses.
- **Results Analysis**: Detailed view of scan findings, including automated IP geolocation displayed directly on mini-maps.
- **Threat Intelligence**: Access up-to-date reports and details on the latest global threat vectors.
- **Threat Reports**: Aggregated view of detected risks and historical data metrics for risk management.
- **Analytics Dashboard**: In-depth analytical views comparing packet traffic over time to identified threat loads.
- **AI Insights**: Powered by AI models to deliver intelligent, predictive analysis on complex security anomalies.
- **Live Activity**: Real-time traffic flow visualizations tracking requests, block rates, and event logs.

### User Management & Experience
- **Authentication**: Complete secure login, signup, and password recovery workflows.
- **Dashboard Overview**: A holistic visual summary highlighting active streams, tracking risk scores, and managing critical infrastructure nodes.
- **Scan History**: Retain and revisit historical scan reports for retroactive auditing.
- **Account Settings**: Advanced management sections including Profile, Security Settings, Appearance Preferences, Notifications, API Integration Keys, Documentation, and Billing.
- **Responsive Architecture**: Mobile-first design crafted with Tailwind CSS for seamless functionality across devices.
- **Fluid Layout**: Integrated page transitions via Framer Motion for a polished native-app feel.
## Screenshots

### 1. Signup Page
![FraudLens Signup Page](attachments/FraudLens-Signuppage.png)
*Clean and modern signup interface for new users.*

### 2. Dashboard
![FraudLens Dashboard](attachments/FraudLens-Dashoard.png)
*Main dashboard showing current risk levels and overall security posture (Risk Score: 00 - Secure).*

### 3. Scan Center
**Scanning a legitimate URL:**
![Scan Center - Normal URL](attachments/FraudLens%20Scan%20page-normal%20URL.png)
*Interface for initiating URL/domain analysis (example: https://google.com).*

**Scanning a suspicious/phishing URL:**
![Scan Center - Phishing URL](attachments/FraudLens%20Scan%20page-phishing%20URL.png)
*Scan Center with a fake PayPal login URL entered for testing.*

### 4. Scan Results - Legitimate URL
![Analysis Report - Clean URL](attachments/FraudLens%20Scan%20result%20-%20normal%20URL%201.png)
*Successful analysis of a legitimate site (Google) showing low risk score and clean status.*

![Intelligence Summary - Normal URL](attachments/FraudLens%20Scan%20result%20-%20normal%20URL%202.png)
*Detailed intelligence summary for a benign URL.*

### 5. Scan Results - Phishing URL
![Analysis Report - Phishing Detection](attachments/FraudLens%20Scan%20result%20-%20phishing%20URL%202.png)
*Detection of a suspicious PayPal phishing attempt with clear warning indicators.*

### 6. Scan History
![Scan History Page](attachments/Fraudlens%20-%20Scan%20History%20page.png)
*History page showing previous scans, including flagged phishing attempts and clean URLs with their respective risk scores.*

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 / Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v7)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **API Services**: Express.js (Backend server integration)
- **AI Integration**: Google GenAI SDK

## 📋 Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed along with `npm` to run this project.

## ⚙️ Local Development

1. **Clone the repository and install dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and ensure any standard environment configurations (like external API keys) are set. At a minimum, set your AI SDK key if accessing Gemini Insights.

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application runs efficiently utilizing `tsx` to serve both frontend routes and local API endpoints concurrently. The local development instance will be broadcast locally on port `3000`.

## 📦 Build for Production

To generate a static build of the application:
```bash
npm run build
```
This generates the optimized bundle in the `/dist` directory.

## 📂 Project Structure

```
fraudlens/
├─ src/
│  ├─ assets/            # Static files, images, branding
│  ├─ components/        # Reusable UI elements, modals, cards, transitions
│  ├─ context/           # React context providers (Auth, Theme)
│  ├─ layouts/           # High-level layouts (AppLayout, AuthLayout, PublicLayout)
│  ├─ modules/           # Feature-based pages categorized by access scope:
│  │   ├─ auth/          # Authentication pages
│  │   ├─ private/       # Authenticated dashboard views and subpages
│  │   └─ public/        # Marketing, Landing, and shared Result views
│  ├─ routes/            # Application router and protected route wrappers
│  ├─ services/          # API integrations and external data fetching
│  └─ utils/             # Helper functions and formatter utilities
├─ package.json          # Project operational scripts and dependencies
└─ server.ts             # Express backend server
```

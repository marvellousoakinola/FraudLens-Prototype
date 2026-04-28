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

### Landing Page
![FraudLens Landing Page](https://github.com/user-attachments/assets/408442e7-e16f-4051-8a55-d171eeb47002)
*Modern landing page with the tagline "Detect fraud before it detects you."*

### Signup Page
![FraudLens Signup Page](https://github.com/user-attachments/assets/72ac79af-0dbf-46d2-aa07-1f01f92a77af)
*Clean and professional signup interface for security professionals.*

### Dashboard
![FraudLens Dashboard](https://github.com/user-attachments/assets/b4d23a40-c8cf-48b7-af1e-f872405783e9)
*Main dashboard showing current risk levels and overall security posture (Risk Score: 00 - Secure).*

### Scan Center

**Scanning a legitimate URL:**
![Scan Center - Normal URL](https://github.com/user-attachments/assets/490dd754-1607-4b3b-95cc-9dd0e04c5e12)

**Scanning a phishing URL:**
![Scan Center - Phishing URL](https://github.com/user-attachments/assets/df47e8d1-3220-446e-8527-a605c6e9d20c)

### Scan Results - Legitimate URL

**Clean Analysis Report:**
![Analysis Report - Clean URL](https://github.com/user-attachments/assets/e7ef1d50-e519-498e-aaa7-0e3df1ae9821)
*Successful scan of a legitimate website (Google) showing minimal risk.*

**Intelligence Summary:**
![Intelligence Summary - Normal URL](https://github.com/user-attachments/assets/b242b194-55d2-4144-b2af-c41198aafc10)

### Scan Results - Phishing Detection

**Phishing URL Detected:**
![Phishing Detection Result](https://github.com/user-attachments/assets/78cf568a-faec-4dda-a32c-87bcd570037b)
*Clear detection of a fake PayPal login page as a potential phishing attempt.*

**Additional Phishing Scan Result:**
![Phishing Scan Result 2](https://github.com/user-attachments/assets/891db725-f7a2-4483-9588-4cebbd77eb71)

### Scan History
![Scan History Page](https://github.com/user-attachments/assets/d43eb6d5-6dc5-4a8e-9ad9-7faf480c6b47)
*History page showing previous scans with risk scores, including flagged phishing attempts.*

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

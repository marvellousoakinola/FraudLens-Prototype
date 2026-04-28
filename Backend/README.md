# FraudLens Backend API

Production-ready cybersecurity SaaS API built with FastAPI and SQLAlchemy.

## Features

- **Authentication**: JWT-based authentication with signup, login, and profile management.
- **Scan Engine**: AI-powered fraud detection using a custom AI engine (`fraudlens_ai`).
- **Statistics & Analytics**: Dashboard and detailed analytics for scan results.
- **Threat Intelligence**: Real-time threat actor tracking.
- **Activity Logs**: Live system and network logs.
- **Reports**: Security audit and penetration test report management.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL (via SQLAlchemy ORM)
- **AI Integration**: Custom engine with LLM support (Groq, HuggingFace, OpenRouter)
- **Authentication**: JWT (JSON Web Tokens)
- **Environment**: Python 3.11+

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL database

### Installation

1. Navigate to the backend directory:
   ```bash
   cd FraudLens_Backkend-main
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   Create a `.env` file based on `.env.example` and add your database URL and LLM API keys.

5. Run the application:
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`.

## API Endpoints

- `POST /auth/signup`: Create a new user account.
- `POST /auth/login`: Authenticate and receive a JWT token.
- `GET /user/me`: Get current user profile.
- `PUT /user/profile`: Update user profile (name, avatar).
- `POST /scan/`: Submit data for AI fraud analysis.
- `GET /scan/history`: Retrieve scan history for the current user.
- `GET /stats/`: Get dashboard overview statistics.
- `GET /stats/analytics`: Get detailed security analytics.
- `GET /intel/actors`: Get threat actor intelligence.
- `GET /logs/live`: Get live system activity logs.
- `GET /reports`: Get security reports.

## Project Structure

- `app/api/routes`: API endpoint definitions (routers).
- `app/core`: Security and dependency configurations.
- `app/db`: Database connection and session management.
- `app/models`: SQLAlchemy database models.
- `app/services`: Business logic and service integrations.
- `fraudlens_ai`: Core AI engine for risk assessment.

# 🏥 Medical Report Analyzer - Complete Project

AI-powered medical report analysis with separate frontend and backend for easy deployment.

## 📦 What's Inside

```
medical-analyzer-fixed/
├── backend/              # Flask API (Port 5000)
│   ├── app.py           # Main API server
│   ├── requirements.txt # Python dependencies
│   ├── utils/           # Helper modules
│   ├── model/           # ML model for risk prediction
│   ├── data/            # Training dataset
│   └── .env.example     # Environment variables template
│
└── frontend/            # Static HTML/CSS/JS (Port 8000)
    └── public/
        ├── index.html   # Entry point (redirects to login)
        ├── templates/   # HTML pages
        │   ├── login.html
        │   ├── signup.html
        │   └── dashboard.html
        └── static/      # CSS & JS
            ├── css/
            └── js/
```

## 🚀 Quick Start (VS Code)

### Step 1: Backend Setup

```bash
# Open terminal in backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your Gemini API key

# Run backend
python app.py
```

✅ Backend runs on: http://localhost:5000

### Step 2: Frontend Setup

```bash
# Open NEW terminal
cd frontend/public

# Run frontend server
python -m http.server 8000
```

✅ Frontend runs on: http://localhost:8000

### Step 3: Open in Browser

Go to: **http://localhost:8000**

- It will redirect to login page
- Click "Sign up" to create account
- Login and start analyzing reports!

## 🔑 Important: Gemini API Key

You need a Google Gemini API key for AI features:

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Paste in `backend/.env` file:
   ```
   GEMINI_API_KEY=your-key-here
   ```

## ✅ Features

- ✅ User Authentication (Sign up / Login)
- ✅ Upload Medical Reports (PDF, Images, Text)
- ✅ Manual Value Entry
- ✅ AI-Powered Analysis using Gemini
- ✅ Risk Score Calculation (0-100)
- ✅ Health Recommendations
- ✅ Multi-language Voice Output (8 Indian languages)
- ✅ Hospital Locator
- ✅ Beautiful UI with Gradient Design

## 🎯 All API URLs Already Configured!

All JavaScript files are pre-configured with:
```javascript
const API_BASE_URL = 'http://localhost:5000';
```

For deployment, just change this one line to your production URL!

## 📱 Testing the App

1. **Create Account**:
   - Name: Test User
   - Email: test@example.com
   - Password: test123

2. **Upload Test Report**:
   Create a file `test_report.txt`:
   ```
   Hemoglobin: 14.5 g/dL
   Blood Sugar: 110 mg/dL
   Cholesterol: 190 mg/dL
   ```

3. **Upload** the file and click "Analyze Report"

4. **View Results**:
   - Risk score and level
   - AI explanation
   - Health tips
   - Hospital finder (if medium/high risk)

## 🎨 UI Preview

The app features:
- ✨ Beautiful gradient background (purple to blue)
- 📱 Fully responsive design
- 🎯 Clean, modern interface
- 🌈 Color-coded risk levels (green/yellow/red)
- 🗣️ Multi-language voice support

## 🔒 Security Features

- Password hashing with werkzeug
- Session-based authentication
- Secure cookies
- Input validation on backend
- File upload restrictions

## 📊 How It Works

1. **User uploads report** → Backend extracts text (OCR for images)
2. **Parse medical values** → Extract hemoglobin, blood sugar, cholesterol
3. **ML Model prediction** → Trained scikit-learn model predicts risk
4. **AI Analysis** → Gemini generates explanations and tips
5. **Display results** → Beautiful UI with all information


## 🎉 Made by Vanshika Bhojani
Happy analyzing! 🚀

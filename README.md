# AI-Assisted Rural Agricultural Product Feedback Portal

## Project Overview
This is a full-stack web application designed for rural farmers to submit feedback and complaints about agricultural products (seeds, fertilizers, pesticides, tools). It supports Text, Voice (via Web Speech API in Tamil), and Image (via Multer) complaint submissions. The system automatically detects potentially defective products when complaints exceed a certain threshold (>= 20).

## Prerequisites
- Node.js (v14 or higher)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

## Setup Instructions

1. **Navigate to the project directory**
   ```bash
   cd c:\Users\Roshini\Desktop\project_feedback_portal\agri-feedback-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Ensure your local MongoDB instance is running.

4. **Run the server**
   ```bash
   node server.js
   ```
   The backend API will run on `http://localhost:5000`.

5. **Access the Application**
   Open your browser and navigate to the frontend directly, or via a simple file server (easiest is using VS Code Live Server extension on `frontend/index.html`).
   Since we're serving statics via express, you can also go to:
   `http://localhost:5000/index.html`

## Features Implemented
- **Farmer Auth:** Register, Login, Dashboard (My Complaints).
- **Feedback:** Submit via Text, Voice (Web Speech API - `ta-IN`), Image Uploads.
- **Admin Dashboard:** Total stats, Chart.js pie and bar charts for analytics, Quality Alerts for highly complained products (>20).
- **Tamil Language Integration:** Form labels and key descriptions include Tamil translations for rural usage.

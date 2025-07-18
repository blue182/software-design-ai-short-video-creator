# software-design-ai-short-video-creator

# 🎬 AI Short Video Creator – Software Design Course Project (HCMUS)

This is the **full-stack project** for an AI-powered short video creator. It is built with **Next.js (Frontend)** and **FastAPI (Backend)**, integrating services like **OpenAI**, **Cloudinary**, **Text-to-Speech**, **Diffusers**, and **MoviePy** to generate viral short videos from trending content.

**Consists of two members:**
1. Nguyen Le Anh Thu - 22120354
2. Nguyen Le Thanh Truc - 22120393

---

## 📦 Installation Guide

### ✅ Frontend (Next.js + Tailwind CSS v3)

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Install Tailwind CSS v3:

```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

Initialize Tailwind config:

```bash
npx tailwindcss init -p
```

Create the following files:

**tailwind.config.js**
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 🔐 Environment Variables

Create a `.env` file inside the `frontend/` folder:

```env
# === Backend Service URL ===
# FastAPI backend endpoint
SERVICE_AI_URL=http://localhost:8000/api/
NEXT_PUBLIC_SERVICE_AI_URL=http://localhost:8000

# === PostgreSQL Database (used with Drizzle ORM) ===
# Format: postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require
DRIZZLE_DATABASE_URL=postgresql://<username>:<password>@<host>/<database>?sslmode=require&channel_binding=require

# === Cloudinary (for media storage) ===
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# === Clerk Authentication ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

```


Start the frontend dev server:

```bash
npm run dev
```

---

### ✅ Backend (FastAPI)

```bash
cd backend
```

Create and activate a virtual environment:

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

(If `requirements.txt` is missing, generate it using:)

```bash
pip freeze > requirements.txt
```

Run the FastAPI server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- `--reload`: Enables auto-reload on code changes
- `--host 0.0.0.0`: Exposes server to LAN/Docker
- `--port 8000`: Default port

---

Need instal ffmpeg to run moviepy 'https://ffmpeg.org/download.html'

## 🔗 API Documentation

Once the backend server is running, open your browser at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

### 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
# === Gemini (Google Generative AI) ===
GEMINI_API_KEY=<your-gemini-api-key>

# === Pixabay (Image & Video Search API) ===
PIXABAY_API_KEY=<your-pixabay-api-key>

# === Together AI (LLM Inference API) ===
TOGETHERAI_API_KEY=<your-togetherai-api-key>

# === Search APIs (SerpAPI, RapidAPI) ===
SERPAPI_KEY=<your-serpapi-key>
RAPIDAPI_KEY=<your-rapidapi-key>

# === Cloudinary (for media storage) ===
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

```

---

## 🎯 Features

- Generate video scripts using OpenAI or Gemini
- Convert script to voice using edge-tts or Bark
- Generate images using AI (Diffusers)
- Stitch video segments and add subtitles
- Select background music automatically
- Upload final video to Cloudinary
- Preview generated video via API

---

## ⚙️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** FastAPI, Uvicorn
- **AI Services:** Gemini, Diffusers, Transformers
- **Media:** MoviePy (for video composition), edge-tts (for speech synthesis)
- **Cloud:** Cloudinary
- **Other libs:** python-dotenv, aiofiles, python-multipart

---

## 📄 License

This project is a final assignment for the course **Software Design (Kỹ thuật phần mềm)** at **University of Science – VNUHCM (HCMUS)**.  
It is intended **for educational purposes only**.

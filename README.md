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

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
OPENAI_API_KEY=your_openai_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_key

PIXABAY_API_KEY=your_pixabay_key

TOGETHERAI_API_KEY=your_togetherai_key

SERPAPI_KEY=your_serpapi_key
RAPIDAPI_KEY=your_rapidapi_key
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
- **AI Services:** OpenAI, Diffusers, Transformers
- **Media:** MoviePy, edge-tts, Bark
- **Cloud:** Cloudinary
- **Other libs:** python-dotenv, aiofiles, python-multipart

---

## 📄 License

This project is a final assignment for the course **Software Design (Kỹ thuật phần mềm)** at **University of Science – VNUHCM (HCMUS)**.  
It is intended **for educational purposes only**.

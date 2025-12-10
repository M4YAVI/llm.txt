# LLM.txt Generator Service

Fail-safe, stylish, and fast microservice to turn any documentation site into a perfectly formatted `llms.txt` and `llms-full.txt` for RAG and LLM context.

## Features
- **Crawler**: Built with `crawl4ai`, supports parallel batched crawling.
- **AI-Powered**: Uses Google Gemini 2.5 Flash (via `google-genai` SDK) for concise summaries and descriptions.
- **Frontend**: Next.js 14 + Tailwind v4 + GSAP for a premium "Neon/Cyberpunk" experience.
- **Real-time Feedback**: Live terminal logs streaming from backend to frontend.


## Quick Start

Open two terminals:

**Terminal 1 (Backend)**:
```bash
cd backend
# (Optional) .venv\Scripts\activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
bun dev
```

## Prerequisites
- **Python 3.11+**
- **Node.js** (or Bun)
- **Git**
- **Gemini API Key** (Get one from Google AI Studio)

## Installation Guide

### 1. Clone & Setup Backend

```bash
cd backend

# Create and activate virtual environment (optional but recommended)
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install dependencies using uv (fast pip alternative) or pip
pip install uv
uv pip install fastapi uvicorn google-genai crawl4ai pydantic-settings websockets

# Install crawler browsers
crawl4ai-setup
```

### 2. Configure Environment
Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies using Bun (recommended) or npm
bun install
# or
npm install
```

## Running the Project

### Start Backend
From the `backend` directory:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Server will run on http://localhost:8000*

### Start Frontend
From the `frontend` directory:
```bash
bun dev
# or
npm run dev
```
*App will run on http://localhost:3000*

## Usage
1. Open http://localhost:3000.
2. Enter a documentation URL (e.g., `https://docs.crawl4ai.com/`).
3. Click **Generate**.
4. Watch the terminal logs as the system crawls and analyzes the site.
5. Copy or Download the generated `llms.txt`.

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and Import the project.
3. Select the `frontend` directory as the Root Directory.
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`).
5. Deploy!

### Backend (Render/Railway/Fly.io)
**Note**: The backend requires a Full Docker environment because of the browser crawler. **It will likely fail on Vercel Serverless Functions.**

**Deploy on Render:**
1. Create a `Web Service` connected to your repo.
2. Select `backend` as the Root Directory.
3. Choose `Docker` as the Runtime.
4. Add Environment Variable:
   - `GEMINI_API_KEY`: Your Gemini API key.
5. Deploy.

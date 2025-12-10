# LLM.txt Generator Service

Fail-safe, stylish, and fast microservice to turn any documentation site into a perfectly formatted `llms.txt` and `llms-full.txt` for RAG and LLM context.

## Features
- **Crawler**: Built with `crawl4ai`, supports parallel batched crawling.
- **AI-Powered**: Uses Google Gemini 2.5 Flash (via `google-genai` SDK) for concise summaries and descriptions.
- **Frontend**: Next.js 14 + Tailwind v4 + GSAP for a premium "Neon/Cyberpunk" experience.
- **Real-time Feedback**: Live terminal logs streaming from backend to frontend.

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

## Troubleshooting
- **Failed to fetch**: Ensure the backend is running on port 8000.
- **Browser errors**: Run `crawl4ai-setup` again to ensure Playwright browsers are installed.

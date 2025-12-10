from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
import uvicorn
import os
import asyncio
from typing import Dict

from crawler_service import crawl_site
from llm_service import generate_project_summary, generate_link_description
from utils import generate_llms_txt, generate_llms_full_txt

app = FastAPI(title="LLM.txt Generator Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    url: str

# Quick in-memory storage for demo purposes
# In production, use Redis or database
job_store: Dict[str, Dict] = {}

from typing import Optional, List

class GenerateResponse(BaseModel):
    status: str
    message: str
    llms_txt: Optional[str] = None
    llms_full_txt: Optional[str] = None
    error: Optional[str] = None
    current_step: Optional[str] = None
    logs: List[str] = []

async def process_generation(url: str):
    print(f"Starting job for {url}")
    # Initialize job state with logs
    job_store[url] = {
        "status": "processing", 
        "current_step": "Initializing...", 
        "logs": ["Job started."]
    }
    
    def log(msg):
        print(msg)
        if url in job_store:
            job_store[url]["logs"].append(msg)
            # Keep only last 10 logs to avoid bloating
            if len(job_store[url]["logs"]) > 20:
                 job_store[url]["logs"] = job_store[url]["logs"][-20:]

    def set_step(step):
        if url in job_store:
            job_store[url]["current_step"] = step
            log(f"Step: {step}")

    try:
        # 1. Crawl
        set_step("Crawling Website")
        log(f"Crawling {url}...")
        
        # We pass our log function to get real-time batch updates
        crawl_result = await crawl_site(url, log_func=log)
        
        if "error" in crawl_result:
            return

        pages = crawl_result.get("pages", [])
        project_name = crawl_result.get("project_name", "Documentation")
        log(f"Crawl complete. Found {len(pages)} pages.")
        
        # 2. AI Summarization & Descriptions
        set_step("Generating Project Summary")
        
        # Generate project summary from the first page (usually Home)
        home_page = pages[0] if pages else {"markdown": ""}
        project_summary = await generate_project_summary(home_page.get("markdown", ""))
        log("Project summary generated.")
        
        # Generate descriptions for each page (can be parallelized)
        set_step(f"Analyzing {len(pages)} Pages")
        
        # We'll do a gather for speed
        tasks = []
        for i, page in enumerate(pages):
            # log(f"Queueing AI analysis for page: {page.get('url')}")
            tasks.append(generate_link_description(page.get("markdown", "")))
        
        log(f"Running concurrent AI tasks for {len(tasks)} pages...")
        descriptions = await asyncio.gather(*tasks)
        
        for i, page in enumerate(pages):
            page["description"] = descriptions[i]
        
        log("AI analysis complete.")
            
        # 3. Generate Files
        set_step("Compiling Artifacts")
        llms_txt = generate_llms_txt(project_name, project_summary, pages)
        llms_full_txt = generate_llms_full_txt(project_name, project_summary, pages)
        
        job_store[url] = {
            "status": "completed",
            "llms_txt": llms_txt,
            "llms_full_txt": llms_full_txt,
            "current_step": "Completed",
            "logs": job_store[url]["logs"] + ["Finished."]
        }
        print(f"Job completed for {url}")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        job_store[url] = {"status": "failed", "error": str(e)}

@app.get("/")
def read_root():
    return {"message": "LLM.txt Generator Service is running. POST to /generate to start."}

@app.post("/generate", response_model=GenerateResponse)
async def generate_pipeline(request: GenerateRequest, background_tasks: BackgroundTasks):
    # Check if already processed or processing
    if request.url in job_store:
        job = job_store[request.url]
        return GenerateResponse(
            status=job.get("status"), 
            message="Job status retrieved",
            llms_txt=job.get("llms_txt"),
            llms_full_txt=job.get("llms_full_txt"),
            error=job.get("error"),
            current_step=job.get("current_step"),
            logs=job.get("logs", [])
        )
    
    # Start background task
    background_tasks.add_task(process_generation, request.url)
    return GenerateResponse(status="started", message="Generation started in background")

@app.get("/result")
async def get_result(url: str):
    if url not in job_store:
        raise HTTPException(status_code=404, detail="Job not found")
    return job_store[url]

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

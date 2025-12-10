FROM python:3.11-slim

# Install system dependencies for Playwright
# We modify the path to ensure text-generation-webui or other scripts function if needed, 
# but primarily we need basic tools.
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
# If users used uv, we might need to generate requirements.txt first. 
# For now, we'll assume we can install directly or specific packages.
# Let's write the packages directly here for reliability in this specific prompt context
# or simpler: copy the code and install.
RUN pip install --no-cache-dir fastapi uvicorn google-genai crawl4ai pydantic-settings websockets

# Install Playwright browsers
RUN crawl4ai-setup
RUN playwright install-deps
RUN playwright install chromium

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

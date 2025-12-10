from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
import asyncio
from typing import List, Dict, Any

async def crawl_site(start_url: str, log_func=None) -> Dict[str, Any]:
    """
    Crawls the site starting from the start_url in batches.
    Returns structured data including project summary info and list of pages.
    """
    
    # Configuration
    md_generator = DefaultMarkdownGenerator(
        options={
            "ignore_links": False,
            "ignore_images": False 
        }
    )
    
    config = CrawlerRunConfig(
        markdown_generator=md_generator,
        cache_mode=CacheMode.ENABLED
    )

    def log(msg):
        if log_func:
            log_func(msg)
        print(msg)

    async with AsyncWebCrawler() as crawler:
        # Step 1: Crawl the entry page
        log(f"Crawling entry page: {start_url}")
        entry_result = await crawler.arun(start_url, config=config)
        
        if not entry_result.success:
            log(f"Failed to crawl entry: {entry_result.error_message}")
            return {"error": entry_result.error_message}

        # Extract internal links from the entry page
        internal_links = entry_result.links.get("internal", [])
        
        # Deduplicate and basic filter
        unique_urls = list(set([link['href'] for link in internal_links if link.get('href')]))
        
        # Limit for safety/speed
        max_pages = 50
        unique_urls = unique_urls[:max_pages] 
        log(f"Found {len(unique_urls)} internal links. Starting batched crawl...")

        pages = []
        
        # Add entry page first
        pages.append({
            "url": start_url,
            "title": "Home",
            "markdown": entry_result.markdown.raw_markdown if hasattr(entry_result.markdown, 'raw_markdown') else str(entry_result.markdown),
            "description": ""
        })

        # Step 2: Crawl subpages in batches
        batch_size = 10
        total_batches = (len(unique_urls) + batch_size - 1) // batch_size
        
        for i in range(0, len(unique_urls), batch_size):
            batch = unique_urls[i : i + batch_size]
            current_batch_num = (i // batch_size) + 1
            log(f"Crawling batch {current_batch_num}/{total_batches} ({len(batch)} pages)...")
            
            subpage_results = await crawler.arun_many(batch, config=config)
            
            success_count = 0
            for res in subpage_results:
                if res.success:
                    pages.append({
                        "url": res.url,
                        "title": "Page", 
                        "markdown": res.markdown.raw_markdown if hasattr(res.markdown, 'raw_markdown') else str(res.markdown),
                        "description": ""
                    })
                    success_count += 1
            
            log(f"Batch {current_batch_num} complete. Populated {success_count} pages.")
        
        return {
            "project_name": "Documentation",
            "pages": pages
        }

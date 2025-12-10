from typing import List, Dict, Any

def generate_llms_txt(project_name: str, summary: str, pages: List[Dict[str, Any]]) -> str:
    """
    Generates the content for llms.txt
    """
    output = []
    output.append(f"# {project_name}")
    output.append("")
    output.append(f"> {summary}")
    output.append("")
    output.append("## Documentation")
    output.append("")
    
    for page in pages:
        title = page.get("title", "Page")
        url = page.get("url", "#")
        desc = page.get("description", "No description")
        output.append(f"- [{title}]({url}): {desc}")
        
    return "\n".join(output)

def generate_llms_full_txt(project_name: str, summary: str, pages: List[Dict[str, Any]]) -> str:
    """
    Generates the content for llms-full.txt
    """
    output = []
    output.append(f"# {project_name}")
    output.append("")
    output.append(f"> {summary}")
    output.append("")
    
    for page in pages:
        output.append("---")
        output.append(f"## [{page.get('title', 'Page')}]({page.get('url', '#')})")
        output.append("")
        output.append(page.get("markdown", ""))
        output.append("")
        
    return "\n".join(output)

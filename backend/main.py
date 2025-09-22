from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json, os, threading

DATA_FILE = os.path.join(os.path.dirname(__file__), "issues.json")
LOCK = threading.Lock()

def now_iso():
    return datetime.utcnow().isoformat() + "Z"

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"issues": [], "next_id": 1}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with LOCK:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

class IssueBase(BaseModel):
    title: str
    description: Optional[str] = ""
    status: Optional[str] = "open"
    priority: Optional[str] = "medium"
    assignee: Optional[str] = None

class IssueCreate(IssueBase):
    pass

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee: Optional[str] = None

class Issue(IssueBase):
    id: int
    createdAt: str
    updatedAt: str

app = FastAPI(title="Simple Issue Tracker API (FastAPI)")

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/issues")
def list_issues(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    assignee: Optional[str] = Query(None),
    sortBy: Optional[str] = "updatedAt",
    sortDir: Optional[str] = "desc",
    page: int = 1,
    pageSize: int = 10
):
    """
    List issues with support for search (title substring), assignee substring search,
    filters (status, priority), sorting and pagination.
    """
    data = load_data()
    issues = list(data.get("issues", []))

    # Search by title substring
    if search:
        issues = [i for i in issues if search.lower() in (i.get("title","").lower())]

    # Filter by status and priority (exact match)
    if status:
        issues = [i for i in issues if i.get("status")==status]
    if priority:
        issues = [i for i in issues if i.get("priority")==priority]

    # Assignee substring search (case-insensitive). This fixes the "assignee search not showing" issue.
    if assignee:
        issues = [i for i in issues if i.get("assignee") and assignee.lower() in i.get("assignee","").lower()]

    # Sorting
    reverse = (sortDir == "desc")
    try:
        issues.sort(key=lambda x: x.get(sortBy) or "", reverse=reverse)
    except Exception:
        pass

    total = len(issues)
    if pageSize <= 0:
        pageSize = 10
    start = (page - 1) * pageSize
    end = start + pageSize
    page_items = issues[start:end]
    return {"items": page_items, "total": total, "page": page, "pageSize": pageSize}

@app.get("/issues/{issue_id}")
def get_issue(issue_id: int):
    data = load_data()
    for i in data.get("issues", []):
        if i.get("id") == issue_id:
            return i
    raise HTTPException(status_code=404, detail="Issue not found")

@app.post("/issues", status_code=201)
def create_issue(issue: IssueCreate):
    data = load_data()
    nid = data.get("next_id", 1)
    now = now_iso()
    new = issue.dict()
    new.update({"id": nid, "createdAt": now, "updatedAt": now})
    data.setdefault("issues", []).append(new)
    data["next_id"] = nid + 1
    save_data(data)
    return new

@app.put("/issues/{issue_id}")
def update_issue(issue_id: int, issue: IssueUpdate):
    data = load_data()
    for idx, i in enumerate(data.get("issues", [])):
        if i.get("id") == issue_id:
            updated = i.copy()
            for k, v in issue.dict(exclude_unset=True).items():
                updated[k] = v
            updated["updatedAt"] = now_iso()
            data["issues"][idx] = updated
            save_data(data)
            return updated
    raise HTTPException(status_code=404, detail="Issue not found")

@app.delete("/issues/{issue_id}")
def delete_issue(issue_id: int):
    """
    Delete an issue by id. Returns 204 on success, 404 if not found.
    """
    data = load_data()
    issues = data.get("issues", [])
    for idx, i in enumerate(issues):
        if i.get("id") == issue_id:
            # remove item
            removed = issues.pop(idx)
            data["issues"] = issues
            save_data(data)
            return {"status": "deleted", "id": issue_id}
    raise HTTPException(status_code=404, detail="Issue not found")
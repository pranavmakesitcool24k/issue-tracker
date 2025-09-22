# Issue Tracker — Simple Project

View, search, sort, and manage issues with an easy web interface.  
Built with FastAPI for the backend and React (Vite + TypeScript) for the frontend.  

---

## Features
- Issues table with columns: id, title, status, priority, assignee, updatedAt
- Search by title or assignee
- Filter by status, priority, or assignee
- Sort by clicking on any column header
- Pagination (page number and page size)
- Create new issues using a modal form
- Edit existing issues
- Delete issues
- Click a row to view full JSON details in a drawer  

---

## Backend — FastAPI  

### Running the backend  
1. Open your terminal and go to the backend folder:
   ```powershell
   cd backend
   ```

2. Create and activate a virtual environment (Windows):
   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```powershell
   uvicorn main:app --reload --port 8000
   ```

The backend runs at http://localhost:8000  

Health check: http://localhost:8000/health  
Returns:
```json
{ "status": "ok" }
```  

---

## Frontend — React (Vite + TypeScript)  

### Running the frontend  
1. Open a new terminal and go to the frontend folder:
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start the dev server:
   ```powershell
   npm run dev
   ```

The frontend runs at http://localhost:3000  

If your backend runs elsewhere, set the API base URL before starting:
```powershell
$env:VITE_API_BASE="http://localhost:8000"
```

---

## Project Structure
```
backend/
  main.py          # FastAPI app with endpoints
  issues.json      # JSON storage for issues
  requirements.txt

frontend/
  src/
    api.ts         # API client
    App.tsx        # App layout (header, footer, description)
    components/
      IssuesList.tsx   # Issues list with search, filters, sorting, pagination
      IssueDetail.tsx  # Drawer to show full JSON
      IssueForm.tsx    # Modal form (create/edit)
  vite.config.ts
```

---

## Notes
- The backend uses issues.json for storage. For production, a database like SQLite or PostgreSQL should be used.
- The frontend has a clean, professional look with proper spacing and centered modal forms.
- Footer displays: Made by Pranav Pardeshi

---

## How to Test the App
1. Start the backend:
   ```powershell
   uvicorn main:app --reload --port 8000
   ```

2. Start the frontend:
   ```powershell
   npm run dev
   ```

3. Open http://localhost:3000

Try the following:
- Search issues by title or assignee
- Filter by status, priority, or assignee
- Sort columns by clicking headers
- Use pagination controls
- Create, edit, and delete issues
- Click a row to see detailed issue information

---

Made by Pranav Pardeshi ❤️

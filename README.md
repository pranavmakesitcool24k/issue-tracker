Issue Tracker — Simple Project

View, search, sort, and manage issues with an easy web interface. Built with FastAPI for the backend and React (Vite + TypeScript) for the frontend.

## Features

- Shows all issues in a table, including columns for id, title, status, priority, assignee, and last updated
- Search by title or assignee
- Filter by status, priority, or assignee
- Sort any column
- Supports pagination (page number and page size)
- Add new issues using a modal form
- Edit existing issues
- Delete issues quickly
- Click any row to see full issue details in a drawer

## Backend — FastAPI

### Running the backend

1. Open your terminal and navigate to the backend folder
2. Create a virtual environment and activate it  
   On Windows:

   python -m venv .venv  
   .venv\Scripts\activate

3. Install requirements:  
   pip install -r requirements.txt
4. Start the backend server:  
   uvicorn main:app --reload --port 8000

The backend runs on http://localhost:8000

For a quick health check, visit http://localhost:8000/health — should return:  
{ "status": "ok" }

## Frontend — React (Vite + TypeScript)

### Running the frontend

1. Open a new terminal and go to the frontend folder
2. Install dependencies:  
   npm install
3. Start the frontend server:  
   npm run dev

The frontend is available at http://localhost:3000

By default, it connects to the backend at http://localhost:8000.  
If your backend is running elsewhere, set the API base address before starting:

Windows PowerShell:  
$env:VITE_API_BASE="http://localhost:8000"

## Project Structure

backend/  
  main.py         # FastAPI app and endpoints  
  issues.json     # JSON storage for issues  
  requirements.txt

frontend/  
  src/  
    api.ts           # API client  
    App.tsx          # App layout  
    components/  
      IssuesList.tsx    # List and table  
      IssueDetail.tsx   # Detail drawer  
      IssueForm.tsx     # Modal form  
  vite.config.ts

## Notes

- The backend uses issues.json to store data. For real production use, this would be a proper database like SQLite or PostgreSQL
- The frontend is designed to have a clean, professional look with good spacing and colors
- Modal forms are centered
- The footer says: Made by Pranav Pardeshi

## How to Test

1. Start the backend (uvicorn main:app --reload --port 8000)
2. Start the frontend (npm run dev)
3. Go to http://localhost:3000

Try these features:

- Search by title or assignee
- Filter by status, priority, or assignee
- Sort by clicking on headers
- Change pages with pagination
- Create, edit, and delete issues
- Click a row to see detailed issue info

Made by Pranav Pardeshi

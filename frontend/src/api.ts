import axios from "axios";

// Base URL can be changed with VITE_API_BASE in .env
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const client = axios.create({
  baseURL: API_BASE,
  headers: {'Content-Type': 'application/json'}
});

// List issues with query params (search, filters, pagination...)
export async function listIssues(params:any){
  const res = await client.get('/issues', { params });
  return res.data;
}

export async function getIssue(id:number){
  const res = await client.get(`/issues/${id}`);
  return res.data;
}

export async function createIssue(payload:any){
  const res = await client.post('/issues', payload);
  return res.data;
}

export async function updateIssue(id:number, payload:any){
  const res = await client.put(`/issues/${id}`, payload);
  return res.data;
}

// New: delete an issue by id
export async function deleteIssue(id:number){
  const res = await client.delete(`/issues/${id}`);
  return res.data;
}
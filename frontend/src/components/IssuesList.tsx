import React, { useEffect, useState } from "react";
import { listIssues, deleteIssue } from "../api";
import { Issue } from "../types";
import IssueDetail from "./IssueDetail";
import IssueForm from "./IssueForm";

/**
 * IssuesList - primary page component showing list of issues, filters, search,
 * sorting, pagination, and actions (create/edit/delete).
 *
 * This component keeps state simple and uses the API helpers from ../api.
 */
export default function IssuesList(){
  const [items, setItems] = useState<Issue[]>([]);
  const [q, setQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Issue | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data whenever dependencies change. Debounce could be added for search in future.
  useEffect(()=>{ fetchData(); }, [q, filterStatus, filterPriority, filterAssignee, sortBy, sortDir, page, pageSize]);

  async function fetchData(){
    try{
      setLoading(true);
      const res = await listIssues({
        search: q || undefined,
        status: filterStatus || undefined,
        priority: filterPriority || undefined,
        assignee: filterAssignee || undefined,
        sortBy,
        sortDir,
        page,
        pageSize
      });
      setItems(res.items || []);
      setTotal(res.total || 0);
    }catch(err){
      console.error(err);
      alert('Failed to fetch issues - see console');
    }finally{
      setLoading(false);
    }
  }

  function toggleSort(field:string){
    if(sortBy===field){
      setSortDir(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  }

  function openCreate(){ setEditing(null); setShowForm(true); }
  function openEdit(it:Issue, e?:React.MouseEvent){ e?.stopPropagation(); setEditing(it); setShowForm(true); }

  async function onDelete(it:Issue, e?:React.MouseEvent){
    e?.stopPropagation();
    const ok = confirm(`Delete issue #${it.id} — "${it.title}" ?`);
    if(!ok) return;
    try{
      await deleteIssue(it.id);
      // refresh current page after delete
      fetchData();
    }catch(err){
      console.error(err);
      alert('Failed to delete issue - see console');
    }
  }

  function onSaved(){ setShowForm(false); fetchData(); }

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div className="controls content-card" style={{display:'flex',flexDirection:'column',gap:12}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
            <input className="input" placeholder="Search title" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ setPage(1); fetchData(); }}} style={{minWidth:220}} />
            <input className="input" placeholder="Search assignee" value={filterAssignee} onChange={e=>setFilterAssignee(e.target.value)} style={{minWidth:160}} />
            <select className="input" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              <option value=''>All status</option>
              <option value='open'>open</option>
              <option value='in_progress'>in_progress</option>
              <option value='closed'>closed</option>
            </select>
            <select className="input" value={filterPriority} onChange={e=>setFilterPriority(e.target.value)}>
              <option value=''>All priority</option>
              <option value='low'>low</option>
              <option value='medium'>medium</option>
              <option value='high'>high</option>
            </select>
          </div>

          <div style={{display:'flex',gap:8}}>
            <button className="button ghost" onClick={()=>{ setQ(''); setFilterAssignee(''); setFilterPriority(''); setFilterStatus(''); setPage(1); }}>Reset</button>
            <button className="button" onClick={()=>{ setPage(1); fetchData(); }}>Search</button>
            <button className="button" onClick={openCreate}>Create Issue</button>
          </div>
        </div>
      </div>

      <div className="table-wrapper content-card">
        <table>
          <thead>
            <tr>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('id')}>id</th>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('title')}>title</th>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('status')}>status</th>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('priority')}>priority</th>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('assignee')}>assignee</th>
              <th style={{cursor:'pointer'}} onClick={()=>toggleSort('updatedAt')}>updatedAt</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} style={{background:'#fff', cursor:'pointer'}} onClick={()=>setSelected(it)}>
                <td>{it.id}</td>
                <td>{it.title}</td>
                <td>{it.status}</td>
                <td>{it.priority}</td>
                <td>{it.assignee}</td>
                <td>{it.updatedAt}</td>
                <td>
                  <div className="actions-row">
                    <button className="button ghost" onClick={(e)=>openEdit(it,e)}>Edit</button>
                    <button className="button ghost" onClick={(e)=>onDelete(it,e)} style={{borderColor:'var(--danger)',color:'var(--danger)'}}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <button className="button ghost" onClick={()=>{ if(page>1) setPage(p=>p-1); }} disabled={page<=1}>Prev</button>
          <div>Page {page} / {pages}</div>
          <button className="button ghost" onClick={()=>{ if(page<pages) setPage(p=>p+1); }} disabled={page>=pages}>Next</button>
        </div>

        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8}}>
          <label style={{color:'var(--muted)'}}>Page size:</label>
          <select className="input" value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1); }} style={{width:100}}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {selected && <IssueDetail issue={selected} onClose={()=>setSelected(null)} />}
      {showForm && <IssueForm issue={editing} onSaved={onSaved} onCancel={()=>setShowForm(false)} />}
    </div>
  )
}
import React, { useEffect, useState } from "react";
import { createIssue, updateIssue } from "../api";
import { Issue } from "../types";

/**
 * IssueForm - used for both creating and editing an issue.
 * This modal is centered on screen and designed for a clean, professional look.
 */
export default function IssueForm({ issue, onSaved, onCancel }:{ issue:Issue | null, onSaved:()=>void, onCancel:()=>void }){
  const [model, setModel] = useState<any>({ title:'', description:'', status:'open', priority:'medium', assignee:'' });
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    if(issue){
      setModel({...issue});
    } else {
      setModel({ title:'', description:'', status:'open', priority:'medium', assignee:'' });
    }
  },[issue]);

  async function save(){
    try{
      setSaving(true);
      if(issue && issue.id){
        await updateIssue(issue.id, {
          title: model.title,
          description: model.description,
          status: model.status,
          priority: model.priority,
          assignee: model.assignee
        });
      } else {
        await createIssue({
          title: model.title,
          description: model.description,
          status: model.status,
          priority: model.priority,
          assignee: model.assignee
        });
      }
      onSaved();
    }catch(err){
      console.error(err);
      alert('Failed to save issue - see console');
    }finally{
      setSaving(false);
    }
  }

  // close when clicking on overlay
  function onOverlayClick(e:React.MouseEvent){
    if(e.target === e.currentTarget) onCancel();
  }

  return (
    <div className="overlay" onClick={onOverlayClick}>
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
          <h3 style={{margin:0}}>{issue ? 'Edit' : 'Create'} Issue</h3>
          <div style={{display:'flex',gap:8}}>
            <button className="button ghost" onClick={onCancel}>Cancel</button>
            <button className="button" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>

        <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr',gap:10}}>
          <label>Title</label>
          <input className="input" value={model.title} onChange={e=>setModel({...model,title:e.target.value})} />

          <label>Description</label>
          <textarea className="input" rows={4} value={model.description} onChange={e=>setModel({...model,description:e.target.value})} />

          <div style={{display:'flex',gap:10}}>
            <div style={{flex:1}}>
              <label>Status</label>
              <select className="input" value={model.status} onChange={e=>setModel({...model,status:e.target.value})}>
                <option value="open">open</option>
                <option value="in_progress">in_progress</option>
                <option value="closed">closed</option>
              </select>
            </div>
            <div style={{flex:1}}>
              <label>Priority</label>
              <select className="input" value={model.priority} onChange={e=>setModel({...model,priority:e.target.value})}>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
          </div>

          <label>Assignee</label>
          <input className="input" value={model.assignee} onChange={e=>setModel({...model,assignee:e.target.value})} />
        </div>
      </div>
    </div>
  )
}
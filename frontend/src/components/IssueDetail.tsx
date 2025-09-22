import React from "react";
import { Issue } from "../types";

export default function IssueDetail({ issue, onClose }:{ issue:Issue, onClose:()=>void }){
  return (
    <div className="drawer">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <strong>Issue #{issue.id}</strong>
        <button className="button ghost" onClick={onClose}>Close</button>
      </div>

      <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr',gap:10}}>
        <div><strong>Title:</strong> {issue.title}</div>
        <div><strong>Status:</strong> {issue.status}</div>
        <div><strong>Priority:</strong> {issue.priority}</div>
        <div><strong>Assignee:</strong> {issue.assignee}</div>
        <div><strong>Updated At:</strong> {issue.updatedAt}</div>
        <div style={{marginTop:8}}><strong>Description</strong><div style={{marginTop:6,whiteSpace:'pre-wrap'}}>{issue.description}</div></div>
        <div style={{marginTop:8}}>
          <strong>Raw JSON</strong>
          <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-word',background:'#fbfdff',padding:8,borderRadius:6,border:'1px solid var(--border)'}}>{JSON.stringify(issue,null,2)}</pre>
        </div>
      </div>
    </div>
  )
}
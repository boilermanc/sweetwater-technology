import { useEffect, useState } from 'react';
import { portalClient } from './client';
import ClientProjectList from './ClientProjectList';
import type { ClientProject } from './ClientProjectList';
export default function ClientWorkspace({onSignOut}:{onSignOut:()=>void}) {
 const [projects,setProjects]=useState<ClientProject[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{
  let active=true;
  async function refresh(){
   setLoading(true);setProjects([]);setError('');
   try{
    const r=await portalClient!.from('sw_client_projects').select('id,title,stage,summary,next_step,due_date,updated_at').order('updated_at',{ascending:false});
    if(!active)return;
    if(r.error)throw r.error;
    setProjects(r.data);
   }catch{if(active)setError('Unable to load your projects. Please refresh or sign in again.');}
   finally{if(active)setLoading(false);}
  }
  void refresh();
  const timer=window.setInterval(()=>void refresh(),60000);
  const focus=()=>void refresh();window.addEventListener('focus',focus);
  return()=>{active=false;clearInterval(timer);window.removeEventListener('focus',focus);};
 },[]);
 return <ClientProjectList projects={projects} loading={loading} error={error} onSignOut={onSignOut} onRefresh={()=>window.location.reload()}/>;
}

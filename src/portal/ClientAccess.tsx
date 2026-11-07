import {useEffect,useState} from 'react';
import {portalClient} from './client';
import {SweetwaterLogo} from '../components/SweetwaterLogo';
import './client-projects.css';
type Project={id:string;title:string;stage:string;summary:string;next_step:string;due_date:string|null;published:boolean;updated_at:string};
type Assignment={user_id:string;sw_client_accounts:{email:string}};
export default function ClientAccess({onBack}:{onBack:()=>void}){
 const [engagements,setEngagements]=useState<{id:string;client:string}[]>([]);
 const [selected,setSelected]=useState('');
 const [message,setMessage]=useState('');
 useEffect(()=>{let active=true;void portalClient!.from('sw_portal_engagements').select('id,client').order('client').then(r=>{if(!active)return;if(r.error)setMessage('Could not load engagements.');else setEngagements(r.data);});return()=>{active=false;};},[]);
 return <div className="client-workspace"><header className="client-header"><SweetwaterLogo/><button onClick={onBack}>Back to admin</button></header><main className="client-main"><p className="client-eyebrow">SWEETWATER ADMIN</p><h1>Client access</h1><p>Write an update for your client, then choose who can see it. Internal records remain private.</p><label className="client-field">Engagement<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Choose a saved engagement</option>{engagements.map(e=><option key={e.id} value={e.id}>{e.client}</option>)}</select></label>{message&&<p role="alert">{message}</p>}{!engagements.length&&!message&&<p>Create an engagement in Guided discovery or Engagement records first.</p>}{selected&&<ProjectEditor key={selected} id={selected}/>}</main></div>;
}
function ProjectEditor({id}:{id:string}){
 const [draft,setDraft]=useState<Project|null>(null);
 const [exists,setExists]=useState(false);
 const [assignments,setAssignments]=useState<Assignment[]>([]);
 const [email,setEmail]=useState('');
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 useEffect(()=>{let active=true;void Promise.all([
  portalClient!.from('sw_client_projects').select('*').eq('id',id).maybeSingle(),
  portalClient!.from('sw_client_project_access').select('user_id,sw_client_accounts(email)').eq('project_id',id)
 ]).then(([p,a])=>{if(!active)return;if(p.error||a.error){setMessage('Could not load project access. Reload to retry.');return;}setExists(Boolean(p.data));setDraft(p.data||{id,title:'',stage:'In progress',summary:'',next_step:'',due_date:null,published:false,updated_at:''});setAssignments(a.data as unknown as Assignment[]);}).catch(()=>{if(active)setMessage('Could not load project access.');});return()=>{active=false;};},[id]);
 async function save(){
  if(!draft||busy)return;setBusy(true);setMessage('');
  try{
   const {updated_at,...values}=draft;
   const r=exists?await portalClient!.from('sw_client_projects').update({...values,updated_at:new Date().toISOString()}).eq('id',id).eq('updated_at',updated_at).select().single():await portalClient!.from('sw_client_projects').insert(values).select().single();
   if(r.error)throw r.error;setDraft(r.data);setExists(true);setMessage(r.data.published?'Update published for assigned clients.':'Saved privately. Clients cannot see this project until you publish it.');
  }catch{setMessage('Save failed. Access may have changed or another person edited this update. Copy your changes and reload before retrying.');}finally{setBusy(false);}
 }
 async function assign(){
  if(busy)return;setBusy(true);setMessage('');
  try{
   const r=await portalClient!.functions.invoke('sweetwater-client-access',{body:{email,project_id:id}});
   if(r.error){let detail='Access could not be saved.';try{detail=(await r.error.context.json()).error||detail;}catch{/* generic fallback */}throw new Error(detail);}
   const a=await portalClient!.from('sw_client_project_access').select('user_id,sw_client_accounts(email)').eq('project_id',id);
   if(a.error)throw new Error('Access saved, but the list could not refresh. Reload to check.');
   setAssignments(a.data as unknown as Assignment[]);setEmail('');setMessage('Access saved. Ask this client to visit sweetwater.technology/portal and request an emailed code.');
  }catch(e){setMessage(e instanceof Error?e.message:'Access could not be saved.');}finally{setBusy(false);}
 }
 async function revoke(userId:string){
  if(busy)return;setBusy(true);setMessage('');
  const r=await portalClient!.from('sw_client_project_access').delete().eq('project_id',id).eq('user_id',userId).select('user_id');
  if(r.error||!r.data?.length)setMessage('Could not confirm removal. Refresh and try again.');else{setAssignments(a=>a.filter(v=>v.user_id!==userId));setMessage('Access removed. This account can no longer fetch this project.');}setBusy(false);
 }
 return <><p role="status">{message}</p>{!draft?<p>Loading project…</p>:<><form className="client-project" onSubmit={e=>{e.preventDefault();void save();}}><h2>Client-visible update</h2><p>Only the fields below are shared. Saving your internal engagement does not change this update.</p><label className="client-field">Project title<input required maxLength={500} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label><label className="client-field">Stage<input required maxLength={100} value={draft.stage} onChange={e=>setDraft({...draft,stage:e.target.value})}/></label><label className="client-field">Progress update<textarea rows={6} maxLength={20000} value={draft.summary} onChange={e=>setDraft({...draft,summary:e.target.value})}/></label><label className="client-field">Next step<textarea rows={3} maxLength={2000} value={draft.next_step} onChange={e=>setDraft({...draft,next_step:e.target.value})}/></label><label className="client-field">Target date<input type="date" value={draft.due_date||''} onChange={e=>setDraft({...draft,due_date:e.target.value||null})}/></label><label><input type="checkbox" checked={draft.published} onChange={e=>setDraft({...draft,published:e.target.checked})}/> Publish for assigned clients</label><p><button disabled={busy}>{busy?'Saving…':'Save update'}</button></p></form><section className="client-project"><h2>Who can see this project</h2>{!exists?<p>Save the update before adding client access.</p>:<><form onSubmit={e=>{e.preventDefault();void assign();}}><label className="client-field">Client email<input type="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></label><button disabled={busy}>Add client access</button></form><p>Clients sign in with an emailed code. Adding access does not send an email.</p>{assignments.map(a=><div className="client-access-row" key={a.user_id}><span>{a.sw_client_accounts.email}</span><button disabled={busy} onClick={()=>void revoke(a.user_id)}>Remove access</button></div>)}{!assignments.length&&<p>No clients have access yet.</p>}</>}</section></>}</>;
}

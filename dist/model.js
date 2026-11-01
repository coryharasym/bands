export const KEY='fac-bands-demo-v1';
export const slots=['Monday 09:00','Tuesday 19:00','Wednesday 19:00','Thursday 19:00','Saturday 10:00'];
export const cities={Calgary:[51.0447,-114.0719],Airdrie:[51.2917,-114.0144],Cochrane:[51.189,-114.467],Edmonton:[53.5461,-113.4938],Halifax:[44.6488,-63.5752],Toronto:[43.6532,-79.3832],Vancouver:[49.2827,-123.1207],London:[51.5074,-0.1278],Tehran:[35.6892,51.389],Sao_Paulo:[-23.5505,-46.6333]};
// IDs are not security tokens; demo fallback supports non-HTTPS local previews.
export const uid=()=>globalThis.crypto?.randomUUID?.()||`demo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
export function seed(){return {version:1,user:null,requests:[],invites:[],events:[],help:[],journeys:[],bands:[
{id:'calgary-men',name:'A few good mornings',host:'Daniel',email:'daniel@example.test',gender:'Men',language:'English',format:'In person',city:'Calgary',lat:51.0447,lon:-114.0719,slot:'Saturday 10:00',zone:'America/Edmonton',location:'Demo meeting room • 123 Example Street',link:'',approved:true,open:true,created:'2026-01-01',members:[{id:'daniel',name:'Daniel',email:'daniel@example.test'},{id:'eli',name:'Eli',email:'eli@example.test'}]},
{id:'online-men',name:'Across the table',host:'Amir',email:'amir@example.test',gender:'Men',language:'English',format:'Online',city:'Calgary',lat:51.0447,lon:-114.0719,slot:'Wednesday 19:00',zone:'America/Edmonton',location:'',link:'https://meet.google.com/',approved:true,open:true,created:'2026-02-01',members:[{id:'amir',name:'Amir',email:'amir@example.test'},{id:'jon',name:'Jon',email:'jon@example.test'}]},
{id:'calgary-women',name:'Room to grow',host:'Sarah',email:'sarah@example.test',gender:'Women',language:'English',format:'In person',city:'Calgary',lat:51.085,lon:-114.13,slot:'Saturday 10:00',zone:'America/Edmonton',location:'Demo community room • 456 Example Avenue',link:'',approved:true,open:true,created:'2026-01-02',members:[{id:'sarah',name:'Sarah',email:'sarah@example.test'},{id:'ruth',name:'Ruth',email:'ruth@example.test'}]},
{id:'farsi-men',name:'Growing together',host:'Reza',email:'reza@example.test',gender:'Men',language:'Farsi',format:'Online',city:'Calgary',lat:51.0447,lon:-114.0719,slot:'Tuesday 19:00',zone:'America/Edmonton',location:'',link:'https://zoom.us/',approved:true,open:true,created:'2026-01-03',members:[{id:'reza',name:'Reza',email:'reza@example.test'}]},
{id:'pending-women',name:'Midweek encouragement',host:'Grace',email:'grace@example.test',gender:'Women',language:'English',format:'Online',city:'Calgary',lat:51.0447,lon:-114.0719,slot:'Thursday 19:00',zone:'America/Edmonton',location:'',link:'https://teams.microsoft.com/',approved:false,open:true,created:'2026-03-01',members:[{id:'grace',name:'Grace',email:'grace@example.test'}]}
]};}
export function distance(a,b){const r=Math.PI/180;const dlat=(b.lat-a.lat)*r,dlon=(b.lon-a.lon)*r;const x=Math.sin(dlat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dlon/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(Math.max(0,1-x)));}
// Convert a future weekly wall-clock time using its IANA zone, including DST.
export function nextMeeting(b,now=new Date()) {
 const [day,time]=b.slot.split(' '),target=weekdays.indexOf(day),[h,min]=time.split(':').map(Number);
 const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:b.zone,year:'numeric',month:'2-digit',day:'2-digit'});
 const p=fmt.formatToParts(now),get=k=>Number(p.find(v=>v.type===k).value);
 let base=new Date(Date.UTC(get('year'),get('month')-1,get('day')));
 if(b.firstDate&&b.firstDate>base.toISOString().slice(0,10))base=new Date(b.firstDate+'T00:00:00Z');
 const delta=(target-base.getUTCDay()+7)%7;
 for(let week=0;week<54;week++){
  const wall=Date.UTC(base.getUTCFullYear(),base.getUTCMonth(),base.getUTCDate()+delta+week*7,h,min);
  let stamp=wall;
  const localParts=new Intl.DateTimeFormat('en-GB',{timeZone:b.zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const wallAt=t=>{const parts=localParts.formatToParts(new Date(t)),n=k=>Number(parts.find(v=>v.type===k).value);return Date.UTC(n('year'),n('month')-1,n('day'),n('hour'),n('minute'));};
  for(let k=0;k<4;k++)stamp+=wall-wallAt(stamp);
  // A local time skipped by a DST change cannot represent a meeting that week.
  if(wallAt(stamp)===wall&&stamp>now.getTime())return new Date(stamp);
 }
 throw Error('Unable to calculate the next meeting.');
}
export function compatible(u,b){if(b.gender!==u.gender||b.language!==u.language)return false;if(u.format!=='Either'&&u.format!==b.format)return false;if(b.format==='In person'&&(!Number.isFinite(u.lat)||!Number.isFinite(u.lon)||distance(u,b)>u.radius))return false;const zone=u.zone||'America/Edmonton';const p=new Intl.DateTimeFormat('en-US',{timeZone:zone,weekday:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(nextMeeting(b));const get=k=>p.find(x=>x.type===k).value;return u.slots.includes(`${get('weekday')} ${get('hour')}:${get('minute')}`);}
export const occupied=(s,b)=>b.members.length+s.requests.filter(r=>r.band===b.id&&r.status==='offered').length;
export function eligible(s,u,b){return b.approved&&b.open&&occupied(s,b)<5&&!b.members.some(m=>m.email===u.email)&&!s.requests.some(r=>r.email===u.email&&r.band===b.id&&['host-declined','declined','unsuitable','left'].includes(r.status))&&compatible(u,b);}
export function match(s,u){if(s.bands.some(b=>b.members.some(m=>m.email===u.email))||s.requests.some(r=>r.email===u.email&&['review','offered'].includes(r.status)))return null;const b=s.bands.filter(b=>eligible(s,u,b)).sort((a,b)=>a.created.localeCompare(b.created))[0];if(!b)return null;const r={id:uid(),band:b.id,email:u.email,name:u.name,profile:structuredClone(u),status:'review',created:new Date().toISOString()};s.requests.push(r);return r;}
export function accept(s,id){const r=s.requests.find(r=>r.id===id);if(!r||r.status!=='review')return false;const b=s.bands.find(b=>b.id===r.band);if(!b.approved||!b.open||occupied(s,b)>=5)return false;r.status='offered';return true;}
export function confirm(s,id){const r=s.requests.find(r=>r.id===id);if(!r||r.status!=='offered')return false;const b=s.bands.find(b=>b.id===r.band);if(!b.approved||b.members.length>=5)return false;b.members.push({id:r.email,name:r.name,email:r.email});r.status='confirmed';if(b.members.length===3)b.started=new Date().toISOString();return true;}
export function stage(b){return !b.approved?'Pending Staff Approval':(!b.open||b.members.length>=5)?'Full':b.members.length>=3?'Active':'Forming';}
export function notify(s,to,subject,body){s.events.unshift({id:uid(),to,subject,body,date:new Date().toISOString()});}

export const weekdays=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export function scheduleValues(day,time,firstDate='',zone='America/Edmonton',now=new Date()){
 if(!weekdays.includes(day)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw Error('Choose a meeting day and a valid start time.');
 if(firstDate){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(firstDate))throw Error('Choose a valid first meeting date.');
  const d=new Date(firstDate+'T12:00:00Z');
  if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==firstDate)throw Error('Choose a valid first meeting date.');
  if(weekdays[d.getUTCDay()]!==day)throw Error('The first meeting date must fall on your weekly meeting day.');
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const get=k=>parts.find(p=>p.type===k).value;
  if(firstDate<get('year')+'-'+get('month')+'-'+get('day'))throw Error('Choose today or a future first meeting date.');
 }
 return {slot:day+' '+time,firstDate};
}

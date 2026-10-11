"use strict";
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const api=async(p,o={})=>{let r;try{r=await fetch("/api"+p,{credentials:"same-origin",method:o.method||"GET",headers:{"X-Req":"1",...(o.json?{"Content-Type":"application/json"}:{})},body:o.json?JSON.stringify(o.json):o.body})}catch{throw Error("Cannot reach the server. Check your connection and try again.")}
 const d=await r.json().catch(()=>null);if(!r.ok)throw Error(d&&typeof d.detail=="string"?d.detail:`Server problem (HTTP ${r.status}). The API may be waking up or misconfigured.`);if(d===null)throw Error("The API returned a non-API response. The /api proxy is not pointing at the backend.");return d};
const net=(m,bad)=>{let e=$("#net");if(!m)return e&&e.remove();if(!e){e=document.createElement("div");e.id="net";document.body.append(e)}e.textContent=m;e.className=bad?"bad":""};
async function wake(){let last="";for(let n=0;n<14;n++){let retry=true;try{const r=await fetch("/api/health",{cache:"no-store"}),j=await r.json().catch(()=>null);
  if(r.ok&&j&&j.ok)return net(),true;retry=[502,503,504].includes(r.status);last=j?`HTTP ${r.status}`:`HTTP ${r.status}, response is not from the API (the /api rewrite in vercel.json is missing or points to the wrong URL)`}catch{last="network error"}
  if(!retry)break;net(n?`Waking the server (free hosting sleeps when idle)… ${n+1}/14`:"Connecting to the server…");await new Promise(r=>setTimeout(r,5000))}
 net(`Cannot reach the API: ${last}`,1);return false}
let U=null,CACHE={};
const PG={home:["Diligite Lumen Sapientiae",1,0],login:["Verifying your identity",7,200],register:["Opening the register",5,150],dash:["Gathering your day",2,280],events:["Aligning the calendar",2,330],notices:["Ringing the bell",3,40],community:["Linking your batch",4,160],resources:["Stacking the library",5,25],gallery:["Developing memories",6,300],profile:["Pressing your portrait",6,190],about:["Meeting the architect",7,260],admin:["Unlocking the control room",7,0]};
const ld=$("#ld");
async function load(k){const[c,f,h]=PG[k],ms=k=="home"?1900:1000;ld.className="";ld.style.setProperty("--h",h+"deg");ld.style.setProperty("--d",ms+"ms");
 ld.innerHTML=`<img src="/logo.svg" alt=""><div class="st f${f}">${[0,1,2,3,4].map(n=>`<i style="--n:${n}"></i>`).join("")}</div><p>${c}</p><b></b>`;
 await new Promise(r=>setTimeout(r,ms));ld.className="off"}
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("in")),{threshold:.15});
const fx=()=>{$$(".rv:not(.in)").forEach(e=>io.observe(e));$$(".card").forEach(c=>c.onmousemove=e=>{const r=c.getBoundingClientRect();c.style.setProperty("--x",e.clientX-r.left+"px");c.style.setProperty("--y",e.clientY-r.top+"px")})};
document.addEventListener("mousemove",e=>{const c=$("#cur");c.style.left=e.clientX+"px";c.style.top=e.clientY+"px"});
$$("[data-split]").forEach(h=>{h.setAttribute("aria-label",h.textContent);h.innerHTML=[...h.textContent].map((c,i)=>`<span aria-hidden="true" style="animation-delay:${2000+i*55}ms">${c==" "?"&nbsp;":c}</span>`).join("")});

/* auth */
const A=$("#auth");
const reg=[["name","Full name"],["father","Father's name"],["mother","Mother's name"],["parent_phone","Parent's phone","tel"],["whatsapp","Your WhatsApp number","tel"],["group_no","Group number","number"],["roll","College roll","text"],["email","Email","email"],["password","Password (8+ chars)","password"],["confirm","Confirm password","password"]];
function authUI(t){A.innerHTML=`<div class="tabs"><button data-auth="login" class="${t=="login"?"on":""}">Log in</button><button data-auth="register" class="${t=="register"?"on":""}">Register</button><button data-x style="margin-left:auto">✕</button></div>`+
 (t=="login"?`<form id="lf"><label>Email, roll or WhatsApp<input name="id" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button class="btn">Enter the portal</button><p class="err"></p></form>`
 :`<form id="rf"><div class="two">${reg.map(([n,l,ty="text"])=>`<label>${l}<input name="${n}" type="${ty}" ${n=="roll"?'inputmode="numeric"':""} required></label>`).join("")}</div><label>Photo in college dress (JPG/PNG/WebP, max 3MB)<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required></label><button class="btn">Submit for approval</button><p class="err"></p></form>`);
 PG_open(t)}
const PG_open=async t=>{A.open||A.showModal()};
document.addEventListener("click",async e=>{const b=e.target.closest("[data-auth],[data-x],[data-a],[data-tab],[data-flt],img[data-lb],#lb");if(!b)return;
 if(b.dataset.auth){authUI(b.dataset.auth)}else if("x" in b.dataset)A.close();else if(b.id=="lb")b.remove();else if(b.dataset.lb)document.body.insertAdjacentHTML("beforeend",`<div id="lb"><img src="${E(b.src)}" alt="${E(b.alt)}"></div>`);
 else if(b.dataset.tab){tab=b.dataset.tab;go()}else if(b.dataset.flt){const v=b.dataset.flt;$$("[data-flt]").forEach(x=>x.classList.toggle("on",x==b));$$("[data-c]").forEach(x=>x.hidden=v!="All"&&x.dataset.c!=v)}
 else if(b.dataset.a)act(b.dataset)});
document.addEventListener("submit",async e=>{e.preventDefault();const f=e.target,fid=f.getAttribute("id"),er=$(".err",f);if(er)er.textContent="";
 try{if(fid=="lf"){await api("/login",{method:"POST",json:Object.fromEntries(new FormData(f))});A.close();U=await api("/me");paint()}
 else if(fid=="rf"){const d=new FormData(f);if(d.get("password")!=d.get("confirm"))throw Error("Passwords do not match");await api("/register",{method:"POST",body:d});f.innerHTML=`<h3>Registration received</h3><p class="ok">An admin will review it. You can log in once approved.</p>`}
 else if(f.dataset.f){const t=f.dataset.f,o=Object.fromEntries(new FormData(f)),id=o.id;delete o.id;
  if(t=="users")await api("/admin/users/"+id,{method:"PATCH",json:o});else if(t=="gallery")await api("/gallery",{method:"POST",body:new FormData(f)});else await api(`/c/${t}${id?"/"+id:""}`,{method:id?"PUT":"POST",json:o});go()}}
 catch(x){if(er)er.textContent=x.message;else alert(x.message)}});

/* actions */
async function act(d){try{const{a,t,i}=d;
 if(a=="del"){if(!confirm("Delete?"))return;t=="gallery"?await api("/gallery/"+i,{method:"DELETE"}):await api(`/c/${t}/${i}`,{method:"DELETE"})}
 else if(a=="ap"||a=="rj")await api(`/admin/users/${i}/status`,{method:"POST",json:{status:a=="ap"?"approved":"rejected"}});
 else if(a=="du"){if(!confirm("Delete this user permanently?"))return;await api("/admin/users/"+i,{method:"DELETE"})}
 else if(a=="ed"){const r=CACHE[t].find(x=>x.id==i),f=$(`[data-f=${t}]`);Object.entries(r).forEach(([k,v])=>f[k]&&(f[k].value=v??""));return f.scrollIntoView({behavior:"smooth"})}
 else if(a=="eu"){const r=CACHE.users.find(x=>x.id==i);$("#ue").innerHTML=`<form class="card" data-f="users"><h3>Edit ${E(r.name)}</h3>${UF.map(f=>inp(f,r[f[0]])).join("")}<label>New password (optional)<input name="password" type="password"></label><input type="hidden" name="id" value="${r.id}"><button class="btn">Save</button></form>`;$("#ue").scrollIntoView({behavior:"smooth"});return}
 else if(a=="out"){await api("/logout",{method:"POST"});U=null;return paint()}
 go()}catch(x){alert(x.message)}}

/* forms */
const F={events:[["title","Title"],["starts","Starts","datetime-local"],["ends","Ends","datetime-local"],["location","Location"],["link","Link","url"],["details","Details","textarea"]],
 notices:[["title","Title"],["category","Category","select:General,Exam,Urgent,Event,Academic"],["pinned","Pinned (0/1)","select:0,1"],["body","Body","textarea"]],
 resources:[["title","Title"],["kind","Type","select:PDF,Video,Doc,Link,Slides,Other"],["url","URL","url"],["description","Description","textarea"]],
 groups:[["no","Group number","number"],["link","WhatsApp invite link","url"]]};
const UF=[["name","Name"],["father","Father"],["mother","Mother"],["parent_phone","Parent phone"],["whatsapp","WhatsApp"],["group_no","Group","number"],["roll","Roll"],["email","Email","email"],["role","Role","select:student,admin"],["status","Status","select:pending,approved,rejected"]];
const inp=([n,l,t="text"],v="")=>`<label>${l}${t=="textarea"?`<textarea name="${n}">${E(v)}</textarea>`:t.startsWith("select:")?`<select name="${n}">${t.slice(7).split(",").map(o=>`<option ${o==v?"selected":""}>${o}</option>`).join("")}</select>`:`<input name="${n}" type="${t}" value="${E(v)}">`}</label>`;

/* pages */
const when=s=>s?new Date(s).toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"}):"";
const lk=(u,t="Open")=>u?`<a class="btn" rel="noopener noreferrer" target="_blank" href="${E(u)}">${t} ↗</a>`:"";
let tab="users";
const P={
 async dash(){const[n,e]=await Promise.all([api("/c/notices"),api("/c/events")]),now=Date.now(),up=e.filter(x=>new Date(x.ends||x.starts)>now).slice(0,3);
  return`<h1>Welcome, ${E(U.name.split(" ")[0])}</h1><div class="grid"><div class="card rv"><span class="tag">Your group</span><div class="big">${U.group_no||"—"}</div></div><div class="card rv"><span class="tag">Roll</span><div class="big">${E(U.roll)}</div></div></div>
  <h2 style="margin-top:40px">Next events</h2><div class="cards">${up.map(ev).join("")||"<p>No upcoming events.</p>"}</div><h2 style="margin-top:40px">Latest notices</h2><div class="cards">${n.slice(0,3).map(nt).join("")||"<p>No notices yet.</p>"}</div>`},
 async events(){const L=await api("/c/events"),now=Date.now(),S=x=>new Date(x.ends||x.starts)<now?"Past":new Date(x.starts)>now?"Upcoming":"Ongoing";
  return`<h1>Events</h1><div class="chips">${["All","Ongoing","Upcoming","Past"].map((c,i)=>`<button data-flt="${c}" class="${i?"":"on"}">${c}</button>`).join("")}</div><div class="cards">${L.map(x=>ev(x,S(x))).join("")||"<p>No events yet.</p>"}</div>`},
 async notices(){const L=await api("/c/notices"),cs=["All",...new Set(L.map(x=>x.category))];
  return`<h1>Notice Board</h1><div class="chips">${cs.map((c,i)=>`<button data-flt="${E(c)}" class="${i?"":"on"}">${E(c)}</button>`).join("")}</div><div class="cards">${L.map(nt).join("")||"<p>No notices yet.</p>"}</div>`},
 async community(){const c=await api("/community");return`<h1>Community</h1><div class="card"><span class="tag">Group ${c.group}</span><h3>Your batch WhatsApp group</h3>${c.link?`<p>One tap and you're in.</p><br>${lk(c.link,"Join on WhatsApp")}`:"<p>Your group's link hasn't been added yet. Ask an admin.</p>"}</div>`},
 async resources(){const L=await api("/c/resources"),ks=["All",...new Set(L.map(x=>x.kind))];
  return`<h1>Resources</h1><div class="chips">${ks.map((c,i)=>`<button data-flt="${E(c)}" class="${i?"":"on"}">${E(c)}</button>`).join("")}</div><div class="grid">${L.map(x=>`<div class="card rv" data-c="${E(x.kind)}"><span class="tag">${E(x.kind)}</span><h3>${E(x.title)}</h3><p>${E(x.description)}</p><br>${lk(x.url)}</div>`).join("")||"<p>No resources yet.</p>"}</div>`},
 async gallery(){const L=await api("/gallery");return`<h1>Gallery</h1><div class="mason">${gi(L)}</div>`},
 async profile(){return`<h1>My profile</h1><div class="card"><div class="row"><img class="av" src="/api/photo/${U.id}" alt=""><div><h3>${E(U.name)}</h3><small>${E(U.email)}</small></div></div><p>Roll ${E(U.roll)} · Group ${U.group_no} · ${E(U.whatsapp)}<br>Parents: ${E(U.father)} &amp; ${E(U.mother)} (${E(U.parent_phone)})</p></div>`},
 async about(){return`<h1>The developer</h1><div class="card"><h3>Tawsif · TSMart</h3><p>Self-taught full-stack developer from Bangladesh. FastAPI, PostgreSQL, Next.js, n8n, Docker and AI integrations. This portal was designed and engineered end to end.</p><br>${lk("https://tawsif-dev.vercel.app","tawsif-dev.vercel.app")}</div>`},
 async admin(){const T=[["users","Approvals & users"],["events","Events"],["notices","Notices"],["resources","Resources"],["groups","WhatsApp groups"],["gallery","Gallery"],...(U.role=="super"?[["db","Database"]]:[])];
  return`<h1>Control room</h1><div class="tabs">${T.map(([k,l])=>`<button data-tab="${k}" class="${tab==k?"on":""}">${l}</button>`).join("")}</div>`+await adm(tab)}};
const ev=(x,s="")=>`<div class="card rv" data-c="${s}"><span class="tag">${s||"Event"} · ${when(x.starts)}</span><h3>${E(x.title)}</h3><p>${E(x.location)}</p><p>${E(x.details)}</p><br>${lk(x.link,"Details")}</div>`;
const nt=x=>`<details class="card rv ${x.pinned?"pin":""} ${E(x.category)}" data-c="${E(x.category)}"><summary><span class="tag">${x.pinned?"📌 ":""}${E(x.category)} · ${when(x.created+"Z")}</span><h3>${E(x.title)}</h3></summary><p style="white-space:pre-wrap;color:var(--iv)">${E(x.body)}</p></details>`;
const gi=L=>L.map(g=>`<img data-lb loading="lazy" src="/media/${E(g.file)}" alt="${E(g.caption||"Batch 28 gallery photo")}">`).join("")||"<p>Photos coming soon.</p>";
async function adm(t){
 if(t=="users"){const L=CACHE.users=await api("/admin/users");return`<div class="cards">${L.map(u=>`<div class="card"><div class="row">${u.role=="super"?"":`<img class="av" src="/api/photo/${u.id}" alt="">`}<div><b>${E(u.name)}</b> <em class="st-${u.status}">${u.status} · ${u.role}</em><small>Roll ${E(u.roll)} · Grp ${u.group_no} · ${E(u.whatsapp)} · ${E(u.email)}<br>Parents: ${E(u.father)} / ${E(u.mother)} · ${E(u.parent_phone)}</small></div></div>${u.role=="student"&&u.status!="approved"?`<button data-a="ap" data-i="${u.id}">Approve</button>`:""}${u.role=="student"&&u.status!="rejected"?`<button data-a="rj" data-i="${u.id}">Reject</button>`:""}${U.role=="super"&&u.role!="super"?`<button data-a="eu" data-i="${u.id}">Edit</button><button data-a="du" data-i="${u.id}">Delete</button>`:""}</div>`).join("")}</div><div id="ue"></div>`}
 if(t=="db"){const s=await api("/super/stats"),u=s.users;return`<div class="grid">${[["Pending",u.pending||0],["Approved",u.approved||0],["Rejected",u.rejected||0],["Events",s.events],["Notices",s.notices],["Resources",s.resources],["Photos",s.gallery],["Groups",s.groups]].map(([l,n])=>`<div class="card"><span class="tag">${l}</span><div class="big">${n}</div></div>`).join("")}</div><div class="card" style="margin-top:18px"><h3>Export</h3><p>Download every registered student as CSV.</p><br><a class="btn" href="/api/super/export.csv">Download users CSV</a></div>`}
 if(t=="gallery"){const L=await api("/gallery");return`<div class="split"><div class="mason">${L.map(g=>`<div><img src="/media/${E(g.file)}" alt=""><button data-a="del" data-t="gallery" data-i="${g.id}">Delete</button></div>`).join("")}</div><form class="card" data-f="gallery"><h3>Upload photo</h3><label>Caption<input name="caption"></label><label>Image<input name="file" type="file" accept="image/*" required></label><button class="btn">Upload</button></form></div>`}
 const L=CACHE[t]=await api("/c/"+t);
 return`<div class="split"><div class="cards">${L.map(r=>`<div class="card"><b>${E(r.title||"Group "+r.no)}</b><small>${E(r.link||r.url||r.category||"")}</small><button data-a="ed" data-t="${t}" data-i="${r.id}">Edit</button><button data-a="del" data-t="${t}" data-i="${r.id}">Delete</button></div>`).join("")||"<p>Nothing yet.</p>"}</div><form class="card" data-f="${t}"><h3>Add / edit</h3>${F[t].map(f=>inp(f)).join("")}<input type="hidden" name="id"><button class="btn">Save</button></form></div>`}

/* shell + router */
const NAV=[["dash","Home"],["events","Events"],["notices","Notices"],["community","Community"],["resources","Resources"],["gallery","Gallery"],["profile","Profile"],["about","Developer"]];
async function go(){if(!U)return;let k=location.hash.slice(2)||"dash";if(!P[k]||(k=="admin"&&U.role=="student"))k="dash";
 let h;try{[h]=await Promise.all([P[k](),load(k)])}catch(x){if(/log in/i.test(x.message)){U=null;return paint()}h=`<p class="err">${E(x.message)}</p>`}
 const n=[...NAV,...(U.role!="student"?[["admin","Admin"]]:[])];
 $("#app").innerHTML=`<aside><a class="brand" href="#/dash"><img src="/logo.svg" alt="NDC crest"><span>Batch 28</span></a>${n.map(([a,l])=>`<a class="nv ${a==k?"on":""}" href="#/${a}">${l}</a>`).join("")}<div class="me">${E(U.name)} · ${U.role}<br><button class="ghost" data-a="out">Log out</button></div></aside><section id="pg">${h}</section>`;fx()}
addEventListener("hashchange",()=>U&&go());
async function paint(){const on=!!U;$("#land").hidden=on;$("#app").hidden=!on;scrollTo(0,0);if(on)return go();document.title="NDC Batch 28 — Notre Dame College, Dhaka";await load("home");fx()}
(async()=>{await wake();$("#gal").innerHTML=gi(await api("/gallery").catch(()=>[]));try{U=await api("/me")}catch{U=null}paint()})();

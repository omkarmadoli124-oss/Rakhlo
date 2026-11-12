const $=s=>document.querySelector(s);
const L=[
["Clean Spare Room, Andheri","Mumbai","Andheri East","400069","Room",80,3200,120,1,1,"Boxes, furniture"],
["Secure Garage, Koramangala","Bengaluru","Koramangala","560034","Garage",150,4500,170,1,0,"Vehicles, furniture"],
["Dry Shop Storage, Karol Bagh","Delhi","Karol Bagh","110005","Shop",120,3800,140,1,1,"Inventory, boxes"],
["Warehouse Bay, Hinjewadi","Pune","Hinjewadi","411057","Warehouse",400,9500,350,1,1,"Bulk goods, appliances"],
["Student Move-out Locker Room","Hyderabad","Madhapur","500081","Room",50,1800,70,0,1,"Trunks, books"],
["Open Yard Corner, Salt Lake","Kolkata","Salt Lake","700091","Yard",200,2600,90,0,0,"Large items"]
].map((a,i)=>({id:i,t:a[0],city:a[1],area:a[2],pin:a[3],type:a[4],sq:a[5],mo:a[6],da:a[7],cctv:a[8],in:a[9],ok:a[10],ver:i!=4}));
const GR=["#A1887F,#795548","#D6C5B3,#A1887F","#8D6E63,#4E342E","#BCAAA4,#795548","#EAE0D0,#A1887F","#795548,#4E342E"];
const CAT=["Household","Student Move-out","Business Inventory","Furniture","Seasonal Items","Documents & Files"];
let S={user:null,bk:[],inv:[],cp:[],dr:[],tab:"Overview",otab:"Overview",f:{q:"",max:99999,type:"",ver:0,cctv:0,in:0,rent:"mo"},ls:{step:0,d:{}}};
try{const x=localStorage.getItem("rakhlo_demo");if(x)Object.assign(S,JSON.parse(x))}catch(e){}
const save=()=>{try{localStorage.setItem("rakhlo_demo",JSON.stringify({user:S.user,bk:S.bk,inv:S.inv,cp:S.cp,dr:S.dr}))}catch(e){}};
const inr=n=>"₹"+Number(n).toLocaleString("en-IN");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const COM=15;
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),2600)}
function go(r){location.hash=r;document.getElementById("dr").classList.remove("open");window.scrollTo(0,0)}
let H=[];
function goBack(){if($('#m').innerHTML){closeM();return}H.pop();go(H.pop()||'home')}
function pic(l,h){return `<div class="img" style="background:linear-gradient(135deg,${GR[l.id%6].split(",")[0]},${GR[l.id%6].split(",")[1]});${h?"height:"+h+"px":""}"><svg width="56" height="56" viewBox="0 0 32 32"><rect x="3" y="9" width="26" height="19" rx="4" fill="none" stroke="#FFFDF8" stroke-width="2"/><path d="M3 14h26M13 18h6" stroke="#FFFDF8" stroke-width="2"/></svg><span class="tag" style="position:absolute;left:8px;top:8px">Demo image</span></div>`}
function card(l){return `<div class="card">${pic(l)}<h3>${l.t}</h3><p style="margin:0">${l.area}, ${l.city} · ${l.sq} sq ft</p>
<div>${l.ver?'<span class="tag v">✓ Verified (demo data)</span>':'<span class="tag">Verification pending</span>'}${l.cctv?'<span class="tag">CCTV</span>':''}<span class="tag">${l.in?"Indoor":"Outdoor"}</span><span class="tag">${l.type}</span></div>
<div class="row" style="justify-content:space-between;align-items:center;margin-top:8px"><span class="price">${inr(l.mo)}<small style="font-weight:400">/mo</small></span><button class="btn s" onclick="A('view',${l.id})">View Details</button></div></div>`}
function A(a,x){
 if(a=="auth")return authM();
 if(a=="view")return viewM(L[x]);
 if(a=="book")return bookM(L[x]);
 if(a=="logout"){S.user=null;save();toast("Logged out");return go("home")}
}
function modal(h){$("#m").innerHTML=`<div class="modal" onclick="if(event.target==this)closeM()"><div class="card">${h}</div></div>`}
function closeM(){$("#m").innerHTML=""}
function authM(){
 modal(`<h2>Welcome to RakhLo</h2><div class="note">Demo mode: no real account is created and no password is stored. Secure Supabase authentication (hashed passwords, email/mobile verification) arrives in Phase 2.</div>
 <label>Full name</label><input id="an"><label>Email</label><input id="ae" type="email"><label>Mobile number</label><input id="am" inputmode="numeric" maxlength="10" placeholder="10-digit number">
 <label>Password (not stored in demo)</label><input id="ap" type="password"><label>I am a</label><select id="ar"><option value="customer">Customer</option><option value="owner">Storage Owner</option></select>
 <div class="row" style="margin-top:14px"><button class="btn" onclick="doAuth()">Continue</button><button class="btn o" onclick="closeM()">Cancel</button></div><p class="demo" style="margin-top:8px">Administrator access is a protected route and is not offered here.</p>`)}
function doAuth(){
 const n=$("#an").value.trim(),e=$("#ae").value.trim(),mo=$("#am").value.trim(),p=$("#ap").value;
 if(n.length<2)return toast("Enter your full name");
 if(!/^\S+@\S+\.\S+$/.test(e))return toast("Enter a valid email");
 if(!/^[6-9]\d{9}$/.test(mo))return toast("Enter a valid 10-digit Indian mobile");
 if(p.length<8)return toast("Password needs 8+ characters");
 S.user={name:n,email:e,mobile:mo,role:$("#ar").value};save();closeM();toast("Signed in (demo)");go(S.user.role=="owner"?"owner":"customer")}
function viewM(l){
 modal(`${pic(l,170)}<h2>${l.t}</h2><p>${l.area}, ${l.city} – ${l.pin}. <span class="demo">Exact address shared only after booking is confirmed.</span></p>
 <div>${l.ver?'<span class="tag v">✓ Verified (demo data)</span>':'<span class="tag">Verification pending</span>'}<span class="tag">${l.type}</span><span class="tag">${l.sq} sq ft</span>${l.cctv?'<span class="tag">CCTV</span>':''}<span class="tag">${l.in?"Indoor":"Outdoor"}</span><span class="tag">Lockable</span></div>
 <p style="margin-top:8px">Permitted: ${l.ok}. Prohibited: stolen, illegal, hazardous, flammable, explosive or perishable items.</p>
 <p><span class="price">${inr(l.mo)}</span>/month · ${inr(l.da)}/day</p>
 <div class="row"><button class="btn" onclick="bookM(L[${l.id}])">Send Booking Request</button><button class="btn o" onclick="closeM()">Close</button></div>`)}
function bookM(l){
 if(!S.user||S.user.role!="customer"){closeM();toast("Please sign up / log in as a Customer first");return authM()}
 const d=new Date().toISOString().slice(0,10);
 modal(`<h2>Book: ${l.t}</h2><label>Start date</label><input id="bs" type="date" min="${d}" value="${d}"><label>Expected end date</label><input id="be" type="date" min="${d}">
 <label>Declare your belongings</label><textarea id="bi" rows="3" placeholder="e.g. 10 boxes of books, 1 sofa"></textarea>
 <label class="chk"><input type="checkbox" id="bc"> I confirm no prohibited items will be stored</label>
 <div class="row" style="margin-top:14px"><button class="btn" onclick="doBook(${l.id})">Submit Request</button><button class="btn o" onclick="closeM()">Cancel</button></div>`)}
function doBook(id){
 const s=$("#bs").value,e=$("#be").value,i=$("#bi").value.trim();
 if(!s||!e||e<=s)return toast("Choose valid start and end dates");
 if(i.length<3)return toast("Declare your belongings");
 if(!$("#bc").checked)return toast("Please accept the prohibited items rule");
 const l=L[id],days=Math.max(1,Math.round((new Date(e)-new Date(s))/864e5)),amt=Math.max(l.da*days,Math.round(l.mo*days/30));
 S.bk.push({id:Date.now(),lid:id,s,e,items:i,amt,st:"Pending"});save();closeM();toast("Request sent – status: Pending");go("customer");S.tab="My Bookings";route()}
const ST=["Pending","Approved","Payment Pending","Confirmed","Active","Completed"];
function bkAct(b){
 const m={"Approved":["Pay now (simulated)","Confirmed"],"Confirmed":["Confirm inventory (both parties)","Active"],"Active":["Confirm final handover","Completed"]};
 if(b.st=="Approved")return `<button class="btn s" onclick="adv(${b.id},'Confirmed')">Pay (simulated)</button>`;
 if(b.st=="Confirmed")return `<button class="btn s" onclick="adv(${b.id},'Active')">Confirm inventory</button>`;
 if(b.st=="Active")return `<button class="btn s" onclick="adv(${b.id},'Completed')">Confirm handover</button>`;
 if(b.st=="Pending")return `<button class="btn s o" onclick="adv(${b.id},'Cancelled')">Cancel</button>`;return ""}
function adv(id,st){const b=S.bk.find(x=>x.id==id);b.st=st;if(st=="Confirmed")b.paid=1;save();toast("Status: "+st+(st=="Confirmed"?" (simulated payment – no real money moved)":""));route()}
function dashTabs(arr,key){return `<div class="tabs">${arr.map(t=>`<button class="btn s ${S[key]==t?"":"o"}" onclick="S.${key}='${t}';route()">${t}</button>`).join("")}</div>`}
function need(role){if(!S.user||S.user.role!=role){return `<div class="w"><section><div class="card"><h2>${role=="owner"?"Storage Owner":"Customer"} dashboard</h2><p>Please log in as a ${role=="owner"?"Storage Owner":"Customer"} to continue.</p><button class="btn" onclick="A('auth')">Login / Sign Up</button></div></section></div>`}return ""}
function customer(){
 const n=need("customer");if(n)return n;
 const t=S.tab,bks=S.bk;let h="";
 if(t=="Overview")h=`<div class="grid g3"><div class="card"><p>Bookings</p><h2>${bks.length}</h2></div><div class="card"><p>Active</p><h2>${bks.filter(b=>b.st=="Active").length}</h2></div><div class="card"><p>Inventory items</p><h2>${S.inv.length}</h2></div></div><p style="margin-top:12px">Namaste, ${esc(S.user.name)}! Find space or track your bookings.</p><button class="btn" onclick="go('find')">Find Storage</button>`;
 else if(t=="Find Storage")h=`<button class="btn" onclick="go('find')">Open search</button>`;
 else if(t=="My Bookings")h=bks.length?bks.map(b=>`<div class="card" style="margin-bottom:10px"><h3>${L[b.lid].t}</h3><p>${b.s} → ${b.e} · ${inr(b.amt)}</p><span class="tag v">${b.st}</span> ${bkAct(b)}${b.st!="Pending"&&b.st!="Cancelled"?`<p class="demo" style="margin-top:6px">Rental agreement PDF: generated in Phase 3 after legal review.</p>`:""}</div>`).join(""):`<p>No bookings yet.</p>`;
 else if(t=="My Inventory")h=`<div class="card"><h3>Add item (entry record)</h3><label>Item name</label><input id="in1"><div class="row"><div style="flex:1"><label>Quantity</label><input id="in2" type="number" min="1" value="1"></div><div style="flex:1"><label>Approx. value (₹)</label><input id="in3" type="number" min="0"></div></div><label>Photographs</label><input type="file" accept="image/*" multiple><p class="demo">Photo upload is stored securely once Supabase is connected (Phase 2).</p><button class="btn" onclick="addInv()">Save item</button></div><div class="tw"><table><tr><th>Item</th><th>Qty</th><th>Value</th><th>Logged</th></tr>${S.inv.map(i=>`<tr><td>${esc(i.n)}</td><td>${i.q}</td><td>${inr(i.v)}</td><td>${i.d}</td></tr>`).join("")}</table></div>`;
 else if(t=="Payments"){const p=bks.filter(b=>b.paid);h=p.length?`<div class="tw"><table><tr><th>Listing</th><th>Amount</th><th>Status</th></tr>${p.map(b=>`<tr><td>${L[b.lid].t}</td><td>${inr(b.amt)}</td><td>Simulated</td></tr>`).join("")}</table></div>`:`<p>No payments yet. Payments are simulated in demo mode.</p>`}
 else if(t=="Complaints")h=`<div class="card"><label>Booking</label><select id="cb">${bks.map(b=>`<option>${L[b.lid].t}</option>`).join("")||"<option>General</option>"}</select><label>Describe the issue (missing / damaged goods, etc.)</label><textarea id="ct" rows="3"></textarea><button class="btn" style="margin-top:10px" onclick="addCp()">Raise complaint</button></div>${S.cp.map(c=>`<div class="card" style="margin-top:10px"><b>${esc(c.b)}</b><p>${esc(c.t)}</p><span class="tag">Open · ${c.d}</span></div>`).join("")}`;
 else h=`<div class="card"><label>Full name</label><input id="pn" value="${esc(S.user.name)}"><label>Email</label><input value="${esc(S.user.email)}" disabled><label>Mobile</label><input value="${esc(S.user.mobile)}" disabled><p class="demo" style="margin-top:8px">Mobile/email verification status: not verified (real OTP verification in Phase 2/3).</p><button class="btn" onclick="S.user.name=$('#pn').value||S.user.name;save();toast('Saved')">Save</button> <button class="btn o" onclick="A('logout')">Logout</button></div>`;
 return `<div class="w dash"><section><h2>Customer Dashboard</h2>${dashTabs(["Overview","Find Storage","My Bookings","My Inventory","Payments","Complaints","Profile"],"tab")}${h}</section></div>`}
function addInv(){const n=$("#in1").value.trim();if(!n)return toast("Enter item name");S.inv.push({n,q:$("#in2").value||1,v:$("#in3").value||0,d:new Date().toLocaleString("en-IN")});save();route()}
function addCp(){const t=$("#ct").value.trim();if(t.length<5)return toast("Please describe the issue");S.cp.push({b:$("#cb").value,t,d:new Date().toLocaleDateString("en-IN")});save();route()}
function owner(){
 const n=need("owner");if(n)return n;
 const t=S.otab,pend=S.bk.filter(b=>b.st=="Pending");let h="";
 const own=S.bk.filter(b=>b.st!="Pending"&&b.st!="Rejected"&&b.st!="Cancelled");
 if(t=="Overview")h=`<div class="card"><h3>Verification status</h3>${["Mobile & email","Identity (authorized provider)","Property ownership proof","Bank account","Selfie / liveness"].map(x=>`<div class="chk">○ ${x} <span class="tag">Not started</span></div>`).join("")}<p class="demo" style="margin-top:8px">Verification uses authorized third-party providers (Phase 3). Nothing is marked verified in this demo.</p></div><div class="grid g3" style="margin-top:12px"><div class="card"><p>Requests</p><h2>${pend.length}</h2></div><div class="card"><p>Listings (draft)</p><h2>${S.dr.length}</h2></div><div class="card"><p>Earnings</p><h2>${inr(own.filter(b=>b.paid).reduce((a,b)=>a+b.amt*(100-COM)/100,0))}</h2></div></div>`;
 else if(t=="Add Space")h=listForm();
 else if(t=="Listings")h=S.dr.length?S.dr.map(d=>`<div class="card" style="margin-bottom:10px"><h3>${esc(d.title)}</h3><p>${esc(d.area)}, ${esc(d.city)} · ${d.sq} sq ft · ${inr(d.mo)}/mo</p><span class="tag">Draft – awaiting verification &amp; admin approval</span><br><button class="btn s" style="margin-top:8px" disabled>Publish (locked)</button></div>`).join(""):`<p>No listings yet.</p>`;
 else if(t=="Booking Requests")h=pend.length?pend.map(b=>`<div class="card" style="margin-bottom:10px"><h3>${L[b.lid].t}</h3><p>${b.s} → ${b.e} · ${inr(b.amt)}<br>Items: ${esc(b.items)}</p><button class="btn s" onclick="adv(${b.id},'Approved')">Accept</button> <button class="btn s o" onclick="adv(${b.id},'Rejected')">Reject</button></div>`).join(""):`<p>No pending requests. (Demo: requests made from a Customer login on this device appear here.)</p>`;
 else if(t=="Active Rentals")h=own.length?own.map(b=>`<div class="card" style="margin-bottom:10px"><b>${L[b.lid].t}</b><p>${b.st} · ${inr(b.amt)}</p></div>`).join(""):`<p>No active rentals.</p>`;
 else {const g=own.filter(b=>b.paid),tot=g.reduce((a,b)=>a+b.amt,0),c=Math.round(tot*COM/100);h=`<div class="card"><h3>Earnings (simulated)</h3><div class="tw"><table><tr><td>Booking amount</td><td>${inr(tot)}</td></tr><tr><td>Commission (${COM}%)</td><td>${inr(c)}</td></tr><tr><td><b>Owner earnings</b></td><td><b>${inr(tot-c)}</b></td></tr><tr><td>Pending payouts</td><td>${inr(tot-c)}</td></tr><tr><td>Completed payouts</td><td>${inr(0)}</td></tr></table></div><p class="demo">Example: customer pays ₹2,000 → owner ₹1,700, RakhLo ₹300. Real payouts need Razorpay + bank verification.</p></div>`}
 return `<div class="w dash"><section><h2>Owner Dashboard</h2>${dashTabs(["Overview","Add Space","Listings","Booking Requests","Active Rentals","Earnings"],"otab")}${h}</section></div>`}
const STEPS=["Basics","Location","Size & Price","Facilities","Preview"];
function listForm(){
 const s=S.ls.step,d=S.ls.d,v=k=>esc(d[k]||"");let f="";
 if(s==0)f=`<label>Storage title</label><input id="f_title" value="${v("title")}"><label>Description</label><textarea id="f_desc" rows="3">${v("desc")}</textarea><label>Property type</label><select id="f_type">${["Room","Garage","Shop","Warehouse","Yard"].map(x=>`<option ${d.type==x?"selected":""}>${x}</option>`).join("")}</select><label>Category</label><select id="f_cat">${CAT.map(x=>`<option>${x}</option>`).join("")}</select>`;
 if(s==1)f=`<label>City</label><input id="f_city" value="${v("city")}"><label>Area</label><input id="f_area" value="${v("area")}"><label>PIN code</label><input id="f_pin" inputmode="numeric" maxlength="6" value="${v("pin")}"><label>Complete address (private – never shown publicly)</label><textarea id="f_addr" rows="2">${v("addr")}</textarea>`;
 if(s==2)f=`<label>Available area (sq ft)</label><input id="f_sq" type="number" value="${v("sq")}"><label>Dimensions (L × W × H)</label><input id="f_dim" value="${v("dim")}"><div class="row"><div style="flex:1"><label>Daily rent (₹)</label><input id="f_da" type="number" value="${v("da")}"></div><div style="flex:1"><label>Monthly rent (₹)</label><input id="f_mo" type="number" value="${v("mo")}"></div></div><div class="row"><div style="flex:1"><label>Min. days</label><input id="f_min" type="number" value="${v("min")||7}"></div><div style="flex:1"><label>Max. days</label><input id="f_max" type="number" value="${v("max")||365}"></div></div><label>Available from</label><input id="f_from" type="date" value="${v("from")}">`;
 if(s==3)f=`${["CCTV","Locking facility","Indoor","Water protection","Ventilation","Loading/unloading access"].map(x=>`<label class="chk"><input type="checkbox" class="fc" value="${x}" ${(d.fac||[]).includes(x)?"checked":""}> ${x}</label>`).join("")}<label>Permitted items</label><input id="f_ok" value="${v("ok")}"><label>Prohibited items</label><input id="f_no" value="${d.no?v("no"):"Stolen, illegal, hazardous, flammable, explosive, perishable"}"><label>Photographs (multiple)</label><input type="file" accept="image/*" multiple><p class="demo">Photos upload to secure storage once Supabase is connected.</p>`;
 if(s==4)f=`<div class="card"><h3>${v("title")}</h3><p>${v("desc")}</p><p>${v("type")} · ${v("area")}, ${v("city")} ${v("pin")} · ${v("sq")} sq ft</p><p class="price">${inr(d.mo||0)}/mo · ${inr(d.da||0)}/day</p><p>${(d.fac||[]).map(x=>`<span class="tag">${x}</span>`).join("")}</p><p class="demo">Full address stays private.</p></div><div class="note" style="margin-top:10px">Submitting saves a draft. It cannot go public until owner verification and admin approval are complete.</div>`;
 return `<div class="card"><div class="steps">${STEPS.map((x,i)=>`<i class="${i<=s?"on":""}"></i>`).join("")}</div><h3>Step ${s+1}: ${STEPS[s]}</h3>${f}<div class="row" style="margin-top:14px">${s?`<button class="btn o" onclick="lstep(-1)">Back</button>`:""}<button class="btn" onclick="lstep(1)">${s==4?"Submit for review":"Next"}</button></div></div>`}
function lstep(dir){
 const s=S.ls.step,d=S.ls.d,g=i=>{const e=document.getElementById(i);return e?e.value.trim():""};
 if(dir>0){
  if(s==0){d.title=g("f_title");d.desc=g("f_desc");d.type=g("f_type");d.cat=g("f_cat");if(d.title.length<4)return toast("Add a storage title")}
  if(s==1){d.city=g("f_city");d.area=g("f_area");d.pin=g("f_pin");d.addr=g("f_addr");if(!d.city||!d.area)return toast("City and area are required");if(!/^\d{6}$/.test(d.pin))return toast("Enter a valid 6-digit PIN")}
  if(s==2){["sq","dim","da","mo","min","max","from"].forEach(k=>d[k]=g("f_"+k));if(!(+d.sq>0)||!(+d.mo>0)||!(+d.da>0))return toast("Enter size, daily and monthly rent");if(+d.min>+d.max)return toast("Min duration exceeds max")}
  if(s==3){d.fac=[...document.querySelectorAll(".fc:checked")].map(x=>x.value);d.ok=g("f_ok");d.no=g("f_no")}
  if(s==4){S.dr.push({...d});S.ls={step:0,d:{}};save();S.otab="Listings";toast("Saved as draft – pending verification");return route()}
  S.ls.step++}else S.ls.step--;
 route()}
function find(){
 const f=S.f;
 const r=L.filter(l=>(!f.q||(l.city+l.area+l.pin).toLowerCase().includes(f.q.toLowerCase()))&&(f.rent=="da"?l.da:l.mo)<=f.max&&(!f.type||l.type==f.type)&&(!f.ver||l.ver)&&(!f.cctv||l.cctv)&&(!f.in||l.in));
 return `<div class="w"><section><h2>Find Storage</h2><p class="demo">All listings below are demo data.</p><div class="card" style="margin-bottom:14px"><div class="grid g3"><div><label>City / area / PIN</label><input value="${esc(f.q)}" oninput="S.f.q=this.value;fl(this)"></div><div><label>Max price (₹)</label><input type="number" value="${f.max==99999?"":f.max}" placeholder="Any" oninput="S.f.max=+this.value||99999;fl(this)"></div><div><label>Property type</label><select onchange="S.f.type=this.value;fl(this)"><option value="">All</option>${["Room","Garage","Shop","Warehouse","Yard"].map(x=>`<option ${f.type==x?"selected":""}>${x}</option>`).join("")}</select></div><div><label>Rental</label><select onchange="S.f.rent=this.value;fl(this)"><option value="mo">Monthly</option><option value="da" ${f.rent=="da"?"selected":""}>Daily</option></select></div></div>
 <div class="row" style="margin-top:8px">${[["ver","Verified owner"],["cctv","CCTV"],["in","Indoor"]].map(([k,n])=>`<label class="chk"><input type="checkbox" ${f[k]?"checked":""} onchange="S.f.${k}=this.checked?1:0;fl(this)"> ${n}</label>`).join("")}</div></div><div class="grid g2" id="res">${r.map(card).join("")||"<p>No spaces match your filters.</p>"}</div></section></div>`}
function fl(){const y=window.scrollY;const a=document.activeElement,id=a&&a.selectionStart!=null;const p=$("#res");const f=S.f;
 p.innerHTML=(L.filter(l=>(!f.q||(l.city+l.area+l.pin).toLowerCase().includes(f.q.toLowerCase()))&&(f.rent=="da"?l.da:l.mo)<=f.max&&(!f.type||l.type==f.type)&&(!f.ver||l.ver)&&(!f.cctv||l.cctv)&&(!f.in||l.in)).map(card).join(""))||"<p>No spaces match your filters.</p>"}
function home(){
 const fq=[["Is RakhLo a real marketplace yet?","This is a Phase 1 demo. Listings, testimonials and payments are simulated and labelled."],["How are owners verified?","Through authorized identity providers plus property and bank checks, then admin approval. Nothing is marked verified without that."],["How does RakhLo earn?","A commission on bookings (default 15%) and optional promoted listings."],["What cannot be stored?","Stolen, illegal, hazardous, flammable, explosive or perishable items."]];
 return `<div class="hero"><div class="w"><h1>Jagah Nahi Hai? RakhLo!</h1><p>Apne extra samaan ke liye affordable storage dhoondho, ya apni khaali jagah ko income mein badlo.</p>
 <div class="row"><button class="btn" onclick="go('find')">Mujhe Jagah Chahiye</button><button class="btn o" onclick="go('list')">Meri Jagah Rent Par Do</button></div>
 <div class="card search"><div><label>City or PIN code</label><input id="hq" placeholder="e.g. Pune or 411057"></div><div><label>Storage size</label><select id="hs"><option>Any size</option><option>Up to 50 sq ft</option><option>50–150 sq ft</option><option>150+ sq ft</option></select></div><div><label>Duration</label><select><option>1 month</option><option>3 months</option><option>6+ months</option></select></div><button class="btn" onclick="S.f.q=$('#hq').value;go('find')">Search</button></div>
 <div class="heroimg" style="background:linear-gradient(135deg,#D6C5B3,#795548);display:flex;align-items:flex-end;padding:12px"><span class="tag">Demo image – replace with real storage photography</span></div></div></div>
 <div class="w"><section><h2>Popular categories</h2><div class="row">${CAT.map(c=>`<span class="tag" style="font-size:.9rem;padding:8px 14px;cursor:pointer" onclick="go('find')">${c}</span>`).join("")}</div></section>
 <section><h2>Featured storage spaces</h2><p class="demo">Demo listings</p><div class="grid g2">${L.slice(0,3).map(card).join("")}</div></section>
 <section id="how">${how()}</section><section><h2>Become a storage partner</h2><div class="grid g3">${["Earn from unused rooms, garages, shops","You set daily & monthly rent","Inventory records protect you","Simple 15% commission, no setup fee"].map(x=>`<div class="card"><b>✓</b> ${x}</div>`).join("")}</div></section>
 <section>${safety()}</section>
 <section><h2>What people say <span class="demo">(demo content)</span></h2><div class="grid g2"><div class="card"><p>“Moved flats without stress – inventory photos gave me peace of mind.”</p><b>Demo customer, Pune</b></div><div class="card"><p>“My spare garage now pays my EMI.”</p><b>Demo owner, Bengaluru</b></div></div></section>
 <section><h2>FAQs</h2>${fq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section></div>`}
function how(){return `<h2>How RakhLo works</h2><div class="grid g3">${["Search a space near you","Send a booking request","Owner accepts; pay securely","Confirm inventory with photos","Store with peace of mind","Collect & confirm handover"].map((x,i)=>`<div class="card"><span class="price">${i+1}</span><p style="margin:0;color:var(--tx)">${x}</p></div>`).join("")}</div>`}
function safety(){return `<h2>Safety &amp; verification</h2><div class="grid g3">${[["Verified owners","Identity, property and bank checks via authorized providers + admin approval."],["Private addresses","Exact addresses are shared only after confirmed booking."],["Entry/exit inventory","Photo-backed records confirmed by both parties."],["Data protection","Role-based access, encrypted records, no unnecessary Aadhaar/PAN."]].map(([a,b])=>`<div class="card"><h3>${a}</h3><p>${b}</p></div>`).join("")}</div><p class="demo" style="margin-top:8px">Verification integrations are planned for Phase 3; no demo record is genuinely verified.</p>`}
function listpage(){return `<div class="w"><section><h2>List Your Space</h2><p>Earn from unused space. ${S.user&&S.user.role=="owner"?"":"Sign up as a Storage Owner to begin."}</p>${S.user&&S.user.role=="owner"?`<button class="btn" onclick="S.otab='Add Space';go('owner')">Start listing</button>`:`<button class="btn" onclick="A('auth')">Sign Up as Owner</button>`}<div style="margin-top:20px">${["Create your owner account","Complete verification","Add your space (multi-step)","Admin review, then go live"].map((x,i)=>`<div class="card" style="margin-bottom:8px"><b>${i+1}.</b> ${x}</div>`).join("")}</div></section></div>`}
const NAV=[["home","Home"],["find","Find Storage"],["list","List Your Space"],["how","How It Works"],["safety","Safety & Trust"]];
function route(){
 const r=(location.hash||"#home").slice(1);
 const nav=NAV.map(([k,n])=>`<a class="${r==k?"on":""}" onclick="go('${k}')">${n}</a>`).join("");
 if(H[H.length-1]!=r)H.push(r);
 $("#back").style.display=r=="home"?"none":"inline-block";
 $("#links").innerHTML=nav;
 $("#dr").innerHTML=nav+(S.user?`<a onclick="go('${S.user.role}')">My Dashboard</a><a onclick="A('logout')">Logout</a>`:"");
 $("#authBtn").textContent=S.user?"Dashboard":"Login / Sign Up";
 $("#authBtn").onclick=()=>S.user?go(S.user.role):A("auth");
 const pg={home,find,list:listpage,how:()=>`<div class="w"><section>${how()}</section></div>`,safety:()=>`<div class="w"><section>${safety()}</section></div>`,customer,owner}[r]||home;
 $("#app").innerHTML=pg()+`<footer><div class="w"><b style="font-size:1.1rem">RakhLo</b><p>Jagah milegi. Bharosa bhi.</p><p>Contact: hello@rakhlo.example (placeholder) · Terms · Privacy · Prohibited Items · Refund Policy (legal pages to be reviewed before launch)</p></div></footer>`}
addEventListener("hashchange",()=>{route();scrollTo(0,0)});route();

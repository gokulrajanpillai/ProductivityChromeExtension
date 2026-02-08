const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/SettingsModal.js","assets/storage.js"])))=>i.map(i=>d[i]);
import"./main.js";import{S as v}from"./storage.js";const S="modulepreload",E=function(h){return"/"+h},y={},w=function(e,c,l){let n=Promise.resolve();if(c&&c.length>0){let p=function(d){return Promise.all(d.map(a=>Promise.resolve(a).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),r=s?.nonce||s?.getAttribute("nonce");n=p(c.map(d=>{if(d=E(d),d in y)return;y[d]=!0;const a=d.endsWith(".css"),u=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const m=document.createElement("link");if(m.rel=a?"stylesheet":S,a||(m.as="script"),m.crossOrigin="",m.href=d,r&&m.setAttribute("nonce",r),document.head.appendChild(m),a)return new Promise((k,g)=>{m.addEventListener("load",k),m.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${d}`)))})}))}function i(s){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=s,window.dispatchEvent(r),!r.defaultPrevented)throw s}return n.then(s=>{for(const r of s||[])r.status==="rejected"&&i(r.reason);return e().catch(i)})};class M{constructor(e){this.container=e}render(e,c,l){this.container.innerHTML=`
      <div class="zen-header">
        <div class="left">
          <div class="zen-logo"></div>
        </div>
        <div class="center">
          <span class="status-text">${e}</span>
        </div>
        <div class="right">
          <button id="sound-toggle" class="icon-btn">Sound</button>
          <button id="settings-btn" class="icon-btn">Settings</button>
        </div>
      </div>
    `,this.container.querySelector("#sound-toggle")?.addEventListener("click",c),this.container.querySelector("#settings-btn")?.addEventListener("click",l)}}class L{constructor(e){this.container=e}render(e,c,l,n){const i=Math.floor(e.remainingSeconds/60).toString().padStart(2,"0"),s=(e.remainingSeconds%60).toString().padStart(2,"0");this.container.innerHTML=`
      <div class="timer-container mode-${e.mode}">
        <div class="timer-ring">
           <!-- SVG Ring would go here -->
           <div class="timer-time">${i}:${s}</div>
        </div>
        <div class="timer-controls">
          ${e.isRunning?'<button id="pause-btn" class="secondary-btn">Pause</button>':'<button id="start-btn" class="primary-btn">Start Focus</button>'}
          <button id="skip-btn" class="text-btn">Skip</button>
        </div>
        <div class="timer-cycle">
           ${e.mode==="focus"?"Focus Cycle":"Rest & Restore"}
        </div>
      </div>
    `,this.container.querySelector("#start-btn")?.addEventListener("click",c),this.container.querySelector("#pause-btn")?.addEventListener("click",l),this.container.querySelector("#skip-btn")?.addEventListener("click",n)}}class ${constructor(e){this.container=e}render(e,c,l,n,i,s){this.container.innerHTML=`
      <div class="task-list-panel">
        <h2 class="task-title">Today's Path</h2>
        
        <div class="add-task-row">
            <input type="text" id="new-task-input" placeholder="Add a calm next step..." />
            <button id="add-task-btn">+</button>
        </div>

        <div class="tasks-container">
          ${e.length===0?'<div class="empty-state">Breathe. The path is clear.</div>':""}
          ${e.map(a=>this.renderTaskRow(a,c)).join("")}
        </div>
      </div>
    `;const r=this.container.querySelector("#new-task-input"),p=this.container.querySelector("#add-task-btn"),d=()=>{r.value.trim()&&(l(r.value.trim()),r.value="")};p?.addEventListener("click",d),r?.addEventListener("keypress",a=>{a.key==="Enter"&&d()}),this.container.querySelectorAll(".task-checkbox").forEach(a=>{a.addEventListener("click",u=>n(u.target.dataset.id))}),this.container.querySelectorAll(".start-task-btn").forEach(a=>{a.addEventListener("click",u=>i(u.target.dataset.id))}),this.container.querySelectorAll(".delete-task-btn").forEach(a=>{a.addEventListener("click",u=>s(u.target.dataset.id))})}renderTaskRow(e,c){const l=e.id===c,n=e.isCompleted;return`
        <div class="task-row ${l?"active":""} ${n?"done":""}" data-id="${e.id}">
            <div class="task-checkbox ${n?"checked":""}" data-id="${e.id}"></div>
            <div class="task-content">
                <span class="task-name">${e.title}</span>
                <span class="task-estimate">${e.estimatedMinutes}m</span>
            </div>
            ${!n&&!l?`<button class="start-task-btn" data-id="${e.id}">Focus</button>`:""}
            ${l?'<span class="active-indicator">Running</span>':""}
            <button class="delete-task-btn" data-id="${e.id}">×</button>
        </div>
      `}}class I{constructor(e){this.container=e}render(e){if(!e){this.container.innerHTML="";return}const c=["Stretch your neck and shoulders","Close your eyes for 20 seconds","Drink some water","Take a deep breath"],l=c[Math.floor(Math.random()*c.length)];this.container.innerHTML=`
      <div class="zen-footer-reminder fade-in">
        <span class="reminder-icon">🍃</span>
        <span class="reminder-text">${l}</span>
      </div>
    `}}const f=document.getElementById("app");if(f){f.innerHTML=`
      <div class="zen-layout">
        <header id="header-zone"></header>
        <main id="main-zone"></main>
        <footer id="footer-zone"></footer>
      </div>
    `;const h=new M(document.getElementById("header-zone"));document.getElementById("main-zone").innerHTML=`
        <div id="timer-section"></div>
        <div id="tasks-section"></div>
    `;const e=new L(document.getElementById("timer-section")),c=new $(document.getElementById("tasks-section")),l=new I(document.getElementById("footer-zone"));let n=null,i=[];const s=async()=>{n=await chrome.runtime.sendMessage({type:"GET_STATE"}),i=await v.getTasks(),r()},r=()=>{if(!n)return;const t=n.isRunning?`Focusing on: ${p(n.activeTaskId)}`:n.mode==="focus"?"Ready when you are":"Break time";h.render(t,g,T),e.render(n,()=>chrome.runtime.sendMessage({type:"START_TIMER",payload:{taskId:d()}}).then(s),()=>chrome.runtime.sendMessage({type:"PAUSE_TIMER"}).then(s),()=>chrome.runtime.sendMessage({type:"SKIP_TIMER"}).then(s)),c.render(i,n.activeTaskId,o=>a(o),o=>u(o),o=>m(o),o=>k(o)),l.render(n.mode!=="focus")},p=t=>t?i.find(o=>o.id===t)?.title||"Task":"...",d=()=>n?.activeTaskId,a=async t=>{const o={id:crypto.randomUUID(),title:t,isCompleted:!1,estimatedMinutes:25,createdAt:Date.now(),order:i.length};i.push(o),await v.saveTasks(i),s()},u=async t=>{const o=i.find(b=>b.id===t);o&&(o.isCompleted=!o.isCompleted,await v.saveTasks(i),s())},m=async t=>{await chrome.runtime.sendMessage({type:"START_TIMER",payload:{taskId:t}}),s()},k=async t=>{i=i.filter(o=>o.id!==t),await v.saveTasks(i),s()},g=async()=>{const t=await v.getSettings();await v.saveSettings({...t,enableSound:!t.enableSound})},T=()=>{w(async()=>{const{SettingsModal:t}=await import("./SettingsModal.js");return{SettingsModal:t}},__vite__mapDeps([0,1])).then(({SettingsModal:t})=>{new t(()=>{s()}).render()})};s(),chrome.runtime.onMessage.addListener(t=>{t.type==="TIMER_UPDATE"&&(n=t.payload,r())})}

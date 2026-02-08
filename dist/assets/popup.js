import"./main.js";import{S as d}from"./storage.js";const n=document.getElementById("app");if(n){n.innerHTML=`
      <div class="popup-container">
        <header class="popup-header">
            <span class="zen-logo-small">Zen</span>
        </header>
        <div class="popup-timer">
            <div class="popup-time-display">--:--</div>
            <div class="popup-controls">
                <button id="pp-toggle" class="icon-btn">⏯</button> 
            </div>
        </div>
        <div class="popup-active-task">
            <span id="active-task-title">No active task</span>
            <button id="mark-done-btn" class="icon-btn" style="display:none">✓</button>
        </div>
        <button id="open-newtab" class="text-btn">Open Dashboard</button>
      </div>
    `;const r=n.querySelector(".popup-time-display"),l=n.querySelector("#pp-toggle"),p=n.querySelector("#active-task-title"),o=n.querySelector("#mark-done-btn"),u=n.querySelector("#open-newtab");let e=null,s=null;const i=async()=>{e=await chrome.runtime.sendMessage({type:"GET_STATE"}),e?.activeTaskId?s=(await d.getTasks()).find(a=>a.id===e.activeTaskId)||null:s=null,c()},c=()=>{if(!e)return;const t=Math.floor(e.remainingSeconds/60).toString().padStart(2,"0"),a=(e.remainingSeconds%60).toString().padStart(2,"0");r.textContent=`${t}:${a}`,l.textContent=e.isRunning?"⏸":"▶",p.textContent=s?s.title:e.mode==="focus"?"Ready to focus":"Break Time",s&&e.mode==="focus"?o.style.display="inline-block":o.style.display="none"};l.addEventListener("click",()=>{if(e?.isRunning)chrome.runtime.sendMessage({type:"PAUSE_TIMER"}).then(i);else{const t=s?.id||e?.activeTaskId;chrome.runtime.sendMessage({type:"START_TIMER",payload:{taskId:t}}).then(i)}}),o.addEventListener("click",async()=>{if(s){const t=await d.getTasks(),a=t.find(m=>m.id===s.id);a&&(a.isCompleted=!0,await d.saveTasks(t),await chrome.runtime.sendMessage({type:"PAUSE_TIMER"}),i())}}),u.addEventListener("click",()=>{chrome.tabs.create({})}),i(),chrome.runtime.onMessage.addListener(t=>{t.type==="TIMER_UPDATE"&&(e=t.payload,c(),e?.activeTaskId!==s?.id?i():c())})}

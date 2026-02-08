import{S as t}from"./storage.js";class l{container;settings=null;onClose;constructor(e){this.container=document.createElement("div"),this.container.className="settings-modal-overlay",this.onClose=e}async render(){this.settings=await t.getSettings(),this.container.innerHTML=`
      <div class="settings-modal">
        <div class="settings-header">
          <h2>Zen Settings</h2>
          <button class="close-btn">×</button>
        </div>
        <div class="settings-body">
          <div class="setting-group">
            <label>Focus Duration (minutes)</label>
            <input type="number" id="focus-duration" value="${this.settings.focusDuration}" min="1" max="60">
          </div>
          <div class="setting-group">
            <label>Break Duration (minutes)</label>
            <input type="number" id="break-duration" value="${this.settings.breakDuration}" min="1" max="30">
          </div>
          <div class="setting-group">
            <label>Long Break Duration (minutes)</label>
            <input type="number" id="long-break-duration" value="${this.settings.longBreakDuration}" min="5" max="60">
          </div>
          <div class="setting-group checkbox-group">
            <label>
              <input type="checkbox" id="enable-sound" ${this.settings.enableSound?"checked":""}>
              Enable Sounds
            </label>
          </div>
           <div class="setting-group checkbox-group">
            <label>
              <input type="checkbox" id="enable-break-reminders" ${this.settings.enableBreakReminders?"checked":""}>
              Break Reminders
            </label>
          </div>
        </div>
        <div class="settings-footer">
          <button class="save-btn">Save Changes</button>
        </div>
      </div>
    `,document.body.appendChild(this.container),this.container.querySelector(".close-btn")?.addEventListener("click",()=>this.close()),this.container.querySelector(".save-btn")?.addEventListener("click",()=>this.save()),this.container.addEventListener("click",e=>{e.target===this.container&&this.close()})}close(){this.container.remove(),this.onClose()}async save(){if(!this.settings)return;const e=this.container.querySelector("#focus-duration"),n=this.container.querySelector("#break-duration"),s=this.container.querySelector("#long-break-duration"),i=this.container.querySelector("#enable-sound"),a=this.container.querySelector("#enable-break-reminders"),o={...this.settings,focusDuration:parseInt(e.value)||20,breakDuration:parseInt(n.value)||5,longBreakDuration:parseInt(s.value)||15,enableSound:i.checked,enableBreakReminders:a.checked};await t.saveSettings(o),this.close()}}export{l as SettingsModal};

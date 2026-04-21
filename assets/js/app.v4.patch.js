
(function(){
  function ensurePatchState(){
    if(!state.randomPack || typeof state.randomPack !== 'object'){
      state.randomPack = { max:40, count:1, numbers:[], cultureIds:[], routeIds:[], today:null };
    }
  }
  function sampleUnique(list, count){
    const arr = list.slice();
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.max(0, Math.min(count, arr.length)));
  }
  function ensurePatchStyle(){
    if(document.getElementById('sports-v4-patch-style')) return;
    const style=document.createElement('style');
    style.id='sports-v4-patch-style';
    style.textContent=`
      .v4-grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
      .v4-grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
      @media(max-width:1120px){.v4-grid-3,.v4-grid-2{grid-template-columns:1fr}}
      .v4-number-wrap{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
      .v4-number-ball{width:54px;height:54px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;background:#123a64;color:#fff;font-weight:700;font-size:20px;box-shadow:0 8px 20px rgba(18,58,100,.18)}
      .v4-card{border:1px solid var(--line);background:#fff;border-radius:20px;padding:16px}
    `;
    document.head.appendChild(style);
  }
  function drawNumbers(){
    ensurePatchState();
    const max = Math.max(1, Number(state.randomPack.max) || 40);
    const count = Math.max(1, Math.min(max, Number(state.randomPack.count) || 1));
    const pool = Array.from({length:max}, (_,i)=>i+1);
    state.randomPack.numbers = sampleUnique(pool, count);
    saveState(); renderApp();
  }
  function drawCulture(count){ ensurePatchState(); state.randomPack.cultureIds = sampleUnique(CULTURE_BANK, count || 3).map(x=>x.id); saveState(); renderApp(); }
  function drawRoutes(count){ ensurePatchState(); state.randomPack.routeIds = sampleUnique(WRITING_ROUTES.filter(x=>x.id!=='all'), count || 2).map(x=>x.id); saveState(); renderApp(); }
  function drawToday(){
    ensurePatchState();
    state.randomPack.today = {
      week: sampleUnique(WEEK_PLAN, 1)[0] || null,
      exec: sampleUnique(DAILY_EXEC, 1)[0] || null,
      culture: sampleUnique(CULTURE_BANK, 1)[0] || null,
      route: sampleUnique(WRITING_ROUTES.filter(x=>x.id!=='all'), 1)[0] || null
    };
    saveState(); renderApp();
  }
  function setRandomField(field, value){ ensurePatchState(); state.randomPack[field] = Number(value) || value; saveState(); renderApp(); }
  function renderRandom(){
    ensurePatchState();
    const r = state.randomPack;
    const cultureList = (r.cultureIds || []).map(id => CULTURE_BANK.find(x=>x.id===id)).filter(Boolean);
    const routeList = (r.routeIds || []).map(id => WRITING_ROUTES.find(x=>x.id===id)).filter(Boolean);
    return `${renderHero('随机训练器：把抽号、抽文化题、抽作文路径做成一个独立入口','适合课堂点名、晚自习热身和当天任务快速生成。',['抽号器','文化题扭蛋','作文路径扭蛋'])}
      <section class="v4-grid-3">
        <div class="v4-card"><h3>随机抽号</h3><div class="subtitle">按班级人数或小组人数抽号。</div><div class="row" style="margin-top:12px"><input class="input" style="max-width:160px" type="number" min="1" value="${escapeHtml(r.max || 40)}" oninput="sportsSetRandomField('max', this.value)"><input class="input" style="max-width:160px" type="number" min="1" value="${escapeHtml(r.count || 1)}" oninput="sportsSetRandomField('count', this.value)"></div><div class="row" style="margin-top:12px"><button class="btn" onclick="sportsDrawNumbers()">开始抽号</button></div><div class="v4-number-wrap">${(r.numbers || []).map(n=>`<span class="v4-number-ball">${n}</span>`).join('') || '<span class="small">还没抽号。</span>'}</div></div>
        <div class="v4-card"><h3>随机文化快题</h3><div class="subtitle">从文化快练题库里直接抽今天的热身题。</div><div class="row" style="margin-top:12px"><button class="btn" onclick="sportsDrawCulture(1)">抽 1 题</button><button class="btn secondary" onclick="sportsDrawCulture(3)">抽 3 题</button></div><ul class="list" style="margin-top:12px">${cultureList.map(item=>`<li><strong>${escapeHtml(item.cat)}</strong><br><span class="small">${escapeHtml(item.stem)}</span></li>`).join('') || '<li>还没抽文化题。</li>'}</ul></div>
        <div class="v4-card"><h3>随机作文路径</h3><div class="subtitle">把六路径练成“先判主模块，再补两环”。</div><div class="row" style="margin-top:12px"><button class="btn" onclick="sportsDrawRoutes(1)">抽 1 条</button><button class="btn secondary" onclick="sportsDrawRoutes(2)">抽 2 条</button></div><ul class="list" style="margin-top:12px">${routeList.map(item=>`<li><strong>${escapeHtml(item.name)}</strong><br><span class="small">${escapeHtml(item.use)}</span></li>`).join('') || '<li>还没抽作文路径。</li>'}</ul></div>
      </section>
      <section class="card" style="margin-top:20px"><div class="space-between"><div><h3>今日组合</h3><div class="subtitle">一键抽出“周计划 + 今日执行 + 文化题 + 作文路径”。</div></div><button class="pill" onclick="sportsDrawToday()">重新抽一组</button></div>${r.today ? `<div class="v4-grid-2" style="margin-top:16px"><div class="block teal"><strong>周计划切片</strong><div class="preview-box" style="margin-top:8px">${escapeHtml(r.today.week ? `${r.today.week.day}｜${r.today.week.am}｜${r.today.week.pm}` : '—')}</div></div><div class="block purple"><strong>今日执行</strong><div class="preview-box" style="margin-top:8px">${escapeHtml(r.today.exec || '—')}</div></div><div class="block"><strong>文化题</strong><div class="preview-box" style="margin-top:8px">${escapeHtml(r.today.culture ? r.today.culture.stem : '—')}</div></div><div class="block good"><strong>作文路径</strong><div class="preview-box" style="margin-top:8px">${escapeHtml(r.today.route ? `${r.today.route.name}｜${r.today.route.bridge}` : '—')}</div></div></div>` : '<div class="block warn" style="margin-top:16px">还没抽今日组合。</div>'}</section>`;
  }
  function reorderViews(){
    const ordered={dashboard:'总览',roadmap:'备考路线',training:'专项训练',culture:'文化快练',writing:'作文六路径',random:'随机训练器',application:'报考管理',review:'模拟复盘',data:'数据中心'};
    Object.keys(VIEW_LABELS).forEach(k=>delete VIEW_LABELS[k]);
    Object.assign(VIEW_LABELS, ordered);
  }
  const originalRenderApp = renderApp;
  renderApp = function(){
    ensurePatchStyle();
    ensurePatchState();
    reorderViews();
    renderSidebar();
    const app=document.getElementById('app');
    if(state.activeView==='random') app.innerHTML=renderRandom();
    else return originalRenderApp();
  };
  window.renderApp = renderApp;
  window.sportsDrawNumbers = drawNumbers;
  window.sportsDrawCulture = drawCulture;
  window.sportsDrawRoutes = drawRoutes;
  window.sportsDrawToday = drawToday;
  window.sportsSetRandomField = setRandomField;
  if(document.readyState!=='loading') renderApp(); else document.addEventListener('DOMContentLoaded', renderApp, {once:true});
})();

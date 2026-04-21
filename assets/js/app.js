
const STORAGE_KEY='sports_recruit_v3_state';
const VIEW_LABELS={dashboard:'总览',roadmap:'备考路线',training:'专项训练',culture:'文化快练',writing:'作文六路径',application:'报考管理',review:'模拟复盘',data:'数据中心'};
const ROADMAP_PHASES=[
  {id:'phase1',title:'第 1—4 周：基础归拢',goal:'先把院校梯队、专项现状、文化短板和写作路线全盘看清。',items:['专项：做 1 次完整基线测试，记录速度、力量、专项动作和稳定项。','文化：每天固定语文时段，优先补字音字形、病句、现代文稳定分。','写作：先练“材料翻译”和立意，不急着追求篇篇满配。','报考：初定冲刺 / 主报 / 保底三层院校，别等到后期才仓促选校。']},
  {id:'phase2',title:'第 5—8 周：双线提速',goal:'专项训练和文化课同时提速，把“会做”拉成“能稳定做对”。',items:['专项：围绕专项动作、爆发力、耐力和比赛节奏做针对性强化。','文化：客观题开始二刷，现代文与文言文要形成固定答题口令。','写作：把 6 条路径练成熟，做到拿到材料能 3 分钟定主模块。','报考：根据阶段成绩调整院校梯队，把不现实目标及时剔除。']},
  {id:'phase3',title:'第 9—10 周：模拟收束',goal:'把训练状态、考试节奏和报考判断压成实战模式。',items:['专项：做接近正式考试的模拟，练起跑、节奏、心态和失误修正。','文化：整卷与限时写作并行，盯住最容易掉分的固定漏洞。','写作：主练“开头定位 + 中段递进 + 结尾收束”，减少空转。','报考：整理证件、资料、时间点和意向院校要求，避免临场混乱。']},
  {id:'phase4',title:'第 11—12 周：考前维稳',goal:'停止大幅摇摆，用熟节奏把状态稳住。',items:['专项：以维持感觉、避免伤病和保持爆发为主，不再大改动作。','文化：重点回顾错题规则、作文六路径和高频失误标签。','写作：每天只做 1 次提纲快判，保持手感，不做大面积推翻。','心态：把注意力放在“今天该做什么”，而不是反复设想结果。']}
];
const ROADMAP_CHECKLIST=[['院校梯队','至少列出冲刺 / 主报 / 保底三层目标，并标注专项与文化匹配度。'],['专项 baseline','用最近一次完整测试确定自己的优势项、稳分项和危险项。'],['文化底线','明确语文至少要守住哪些客观题模块，作文要走哪条主路线。'],['资料与流程','把报名、材料、证件、照片、体检、确认等流程做成单页清单。'],['模拟与修正','每周至少做一次“专项 + 文化/写作”双线复盘，及时修正方向。']];
const WEEK_PLAN=[
  {day:'周一',am:'专项技术拆分 + 爆发力',pm:'语文字音/病句/排序',night:'10 分钟作文审题快判'},
  {day:'周二',am:'专项核心组合训练',pm:'现代文阅读 + 复盘',night:'整理当天训练与错题规则'},
  {day:'周三',am:'力量或耐力维持',pm:'文言文/古诗文',night:'写作一条路径口头展开'},
  {day:'周四',am:'专项模拟一组',pm:'语言运用 + 选择题纠偏',night:'院校/报名信息核对'},
  {day:'周五',am:'专项速度与稳定性',pm:'作文提纲 + 范文拆结构',night:'错题回看，不贪多'},
  {day:'周六',am:'专项完整模拟',pm:'整卷或半卷限时',night:'周总结：保留什么、下周改什么'},
  {day:'周日',am:'主动恢复 / 拉伸 / 轻技术',pm:'轻量复盘 + 名句/规则回顾',night:'清空杂事，准备下一周'}
];
const DAILY_EXEC=['今天的专项主任务只有 1 个，不要把训练目标写成一串口号。','今天的语文主任务只有 1 个模块，做完要留下错因。','今天至少做 1 次作文路径速判：主模块是谁，后两环怎么补位。','今天至少做 1 条报考/流程确认，别把系统性工作全拖到最后。','睡前只看规则和提纲，不大量刷新题，避免节奏失控。'];
const WRITING_ROUTES=[
  {id:'all',name:'全部路径',short:'六条都看',use:'先判断材料主矛盾，再决定谁先写深。',risk:'平均用力最容易写散。',bridge:'真正关键不是把三点都写到，而是写出主次和递进。',focus:'all'},
  {id:'r1',name:'人际支持 → 医体工融合 → 人工智能',short:'先人后专业再技术',use:'材料首先落在情绪、关系、陪伴、团队氛围时最稳。',risk:'容易把“支持”写成空泛鸡汤。',bridge:'情感支持能稳住人，但不能自动解决训练与康复中的专业难题。',focus:'人际支持'},
  {id:'r2',name:'人际支持 → 人工智能 → 医体工融合',short:'先守住人的主体性',use:'材料涉及舆论压力、评价失真、情绪化判断时很好用。',risk:'容易把技术写成权威本身。',bridge:'数据能帮助我们看清问题，但真正决定问题能否被解决的，仍是系统协同。',focus:'人际支持'},
  {id:'r3',name:'医体工融合 → 人际支持 → 人工智能',short:'先补科学短板',use:'材料强调训练、伤病、康复、器械、保障时优先用。',risk:'专业词太多会显得僵硬。',bridge:'科学方案并不会自动落地，它还需要被理解、被执行、被坚持。',focus:'医体工融合'},
  {id:'r4',name:'医体工融合 → 人工智能 → 人际支持',short:'先体系，再提效，后升华',use:'材料适合写行业、制度、协同、现代化时很合适。',risk:'结尾若不补人际支持，整篇会只剩冷技术。',bridge:'再先进的体系和技术，最终都要落到具体的人身上。',focus:'医体工融合'},
  {id:'r5',name:'人工智能 → 人际支持 → 医体工融合',short:'先肯定技术，再限边界',use:'材料出现平台、算法、数据、智能设备时适合。',risk:'最忌讳把技术全盘否定。',bridge:'问题不在要不要用技术，而在能否让技术回到辅助人、服务人的位置。',focus:'人工智能'},
  {id:'r6',name:'人工智能 → 医体工融合 → 人际支持',short:'先时代趋势，再系统承接',use:'适合写格局较大的材料：数字化、治理、行业升级。',risk:'容易写大写空，落不到人。',bridge:'体育的现代化不是把人交给技术，而是借技术、靠系统、为了人。',focus:'人工智能'}
];
const CULTURE_BANK=[
  {id:'c1',cat:'基础语用',difficulty:'基础',stem:'下列词语中加点字读音完全正确的一项是（ ）。',options:['跬（kuǐ）步、契（qì）阔、造诣（yì）','木讷（nà）、慰藉（jí）、粗犷（kuàng）','谬（miù）论、悲恸（tòng）、狙（jū）击','纤（qiān）维、炽（zhì）热、隽（juàn）永'],answer:0,analysis:'A 正确。B“藉”应读 jiè；C“狙”读 jū 没错，但常见教材更稳的是 A 全对；D“纤维”应读 xiān，“炽热”应读 chì。',tip:'体育单招文化线的基础题，一定先守住“会读、会分辨”的稳分。'},
  {id:'c2',cat:'基础语用',difficulty:'基础',stem:'下列句子中没有语病的一项是（ ）。',options:['通过建立每周双线计划，使考生能够更稳定地推进专项和文化。','是否先稳住语文客观题，是单招文化分能否守底线的重要因素。','把训练日志写清楚，不仅能帮助复盘，而且能减少重复犯错。','学校应该根据考生专项差异，避免不要一刀切地安排恢复计划。'],answer:2,analysis:'C 正确。A 主语残缺；B 两面对一面；D 否定失当。',tip:'病句题不要靠耳感，先看“谁做什么”。'},
  {id:'c3',cat:'基础语用',difficulty:'提升',stem:'把下列句子填入横线处，衔接最恰当的一项是（ ）。\n真正有效的复盘，不是把结果再抄一遍，________，最后回到下一次训练或下一张卷子里验证。',options:['而是先命名问题，再提炼规则','而是先直接找借口，再追问原因','所以只要把答案背熟就可以','并且最好完全依赖他人的总结'],answer:0,analysis:'A 最顺。复盘的顺序应该是“发现问题—提炼规则—再验证”。',tip:'排序和衔接题先找动作链。'},
  {id:'c4',cat:'阅读方法',difficulty:'基础',stem:'现代文阅读最稳的起手动作是（ ）。',options:['先做选择题，靠排除法碰答案','先看问答题，再逐段概括观点或情节','先找作者生平，再猜主旨','先背模板，再往上套'],answer:1,analysis:'现代文最稳的起手是先看问答题，再逐段概括，这样回头做客观题时只剩逻辑核对。',tip:'单招文化时间紧，更要用稳方法。'},
  {id:'c5',cat:'古诗文',difficulty:'基础',stem:'文言翻译最稳的三步是（ ）。',options:['先断句，再背答案，最后补情感','找语境—逐字组词—补全成分','先看注释，完全照抄译文','先猜大意，细节不用管'],answer:1,analysis:'文言翻译最稳的三步就是“找语境—逐字组词—补全成分”。',tip:'不会的字也别躲，翻译题要把得分点翻出来。'},
  {id:'c6',cat:'古诗文',difficulty:'提升',stem:'古诗词鉴赏中，“诗人有什么情感，就会寄托在什么事情/物品上”，这句话提醒你先抓（ ）。',options:['修辞术语数量','意象与情感关系','作者八卦轶事','是否押韵'],answer:1,analysis:'古诗鉴赏先抓意象与情感关系，再谈手法。',tip:'先“看物”，再“看情”，再“看怎么写”。'},
  {id:'c7',cat:'写作路由',difficulty:'基础',stem:'材料主要谈“团队支持、家长陪伴、教练理解如何帮助运动员挺过低谷”，最适合作为主模块的路径起点是（ ）。',options:['人际支持','医体工融合','人工智能','先不判断，六条平均写'],answer:0,analysis:'主问题落在关系、支持、陪伴上，当然先写人际支持。',tip:'作文速判先找主矛盾。'},
  {id:'c8',cat:'写作路由',difficulty:'基础',stem:'材料主要谈“伤病评估、训练监测、康复方案联动”，最适合优先启动的路径是（ ）。',options:['人际支持','医体工融合','人工智能','励志鸡汤'],answer:1,analysis:'这类材料最稳的切口是医体工融合。',tip:'只要出现训练、康复、器械、保障，先想医体工融合。'},
  {id:'c9',cat:'写作路由',difficulty:'基础',stem:'材料主要谈“可穿戴设备、算法推荐、数据辅助决策”，最适合优先启动的路径是（ ）。',options:['人工智能','人际支持','医体工融合','完全不用技术'],answer:0,analysis:'涉及平台、算法、设备、数据时，优先考虑人工智能路径。',tip:'肯定技术，但别把人交给技术。'},
  {id:'c10',cat:'基础语用',difficulty:'提升',stem:'下列对成语使用的判断，最恰当的一项是（ ）。',options:['复盘时追问根源，才算釜底抽薪。','只做一套题就胸有成竹，真是如履薄冰。','把训练计划写满等于稳扎稳打。','院校资料没看就报名，可谓高屋建瓴。'],answer:0,analysis:'“釜底抽薪”比喻从根本上解决问题，用在追问根源最恰当。',tip:'成语题先逐字翻译。'},
  {id:'c11',cat:'阅读方法',difficulty:'提升',stem:'文学类文本阅读中，最先要做的事通常是（ ）。',options:['空喊手法','逐段概括“谁在做什么”','只看标题不看正文','只找金句'],answer:1,analysis:'文学类文本先逐段概括“谁在做什么”，再落到人物、情节、主题、语言。',tip:'先有文本事实，后有分析大词。'},
  {id:'c12',cat:'写作路由',difficulty:'提升',stem:'如果材料既谈“数字化训练”又谈“运动员焦虑与失真评价”，更稳的写法是（ ）。',options:['只骂技术','主模块先写人工智能，再补人际支持和系统协同','六条都写成同样分量','完全绕开材料'],answer:1,analysis:'这类材料要先肯定技术趋势，再写边界和协同。',tip:'高分不是平均写满，而是主模块写深。'}
];
const DEFAULT_STATE={
  activeView:'dashboard',
  examDate:'2026-03-31',
  cultureFilter:'all',
  cultureOnlyWrong:false,
  cultureOnlyFav:false,
  cultureCurrentId:'c1',
  writingRoute:'all',
  writingMaterial:'',
  trainingMetrics:[
    {name:'专项完成度',current:'70',target:'85',status:'稳步推进'},
    {name:'爆发力',current:'68',target:'80',status:'需要专项强化'},
    {name:'稳定性',current:'66',target:'82',status:'容易波动'},
    {name:'恢复管理',current:'60',target:'78',status:'睡眠与拉伸要跟上'}
  ],
  dailyChecks:{},
  weeklyChecks:{},
  colleges:[
    {school:'',sport:'',tier:'主报',spec:'',culture:'',status:'待确认',note:''},
    {school:'',sport:'',tier:'冲刺',spec:'',culture:'',status:'待确认',note:''},
    {school:'',sport:'',tier:'保底',spec:'',culture:'',status:'待确认',note:''}
  ],
  drillRecords:{},
  simulationLogs:[],
  notes:''
};
function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
function hydrateState(raw){
  const base=clone(DEFAULT_STATE);
  if(!raw || typeof raw!=='object') return base;
  return Object.assign(base, raw, {
    trainingMetrics:Array.isArray(raw.trainingMetrics)?raw.trainingMetrics:base.trainingMetrics,
    colleges:Array.isArray(raw.colleges)?raw.colleges:base.colleges,
    drillRecords:raw.drillRecords && typeof raw.drillRecords==='object'?raw.drillRecords:{},
    dailyChecks:raw.dailyChecks && typeof raw.dailyChecks==='object'?raw.dailyChecks:{},
    weeklyChecks:raw.weeklyChecks && typeof raw.weeklyChecks==='object'?raw.weeklyChecks:{},
    simulationLogs:Array.isArray(raw.simulationLogs)?raw.simulationLogs:[],
  });
}
function loadState(){ try{ const raw=localStorage.getItem(STORAGE_KEY); return raw?hydrateState(JSON.parse(raw)):clone(DEFAULT_STATE);}catch(e){ return clone(DEFAULT_STATE);} }
let state=loadState();
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function showToast(msg){ const el=document.getElementById('toast'); if(!el) return; el.textContent=msg; el.classList.add('show'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>el.classList.remove('show'),1800); }
function escapeHtml(str){ return String(str==null?'':str).replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
function countCorrect(){ const vals=Object.values(state.drillRecords||{}); const answered=vals.filter(v=>v && v.answered).length; const correct=vals.filter(v=>v && v.correct).length; return {answered, correct, rate: answered?Math.round(correct/answered*100):0}; }
function daysToExam(){ const target=new Date(state.examDate+'T00:00:00'); const now=new Date(); const diff=Math.ceil((target-now)/86400000); return Number.isFinite(diff)?diff:0; }
function completedDaily(){ return Object.values(state.dailyChecks||{}).filter(Boolean).length; }
function completedWeekly(){ return Object.values(state.weeklyChecks||{}).filter(Boolean).length; }
function simulationStats(){ const arr=state.simulationLogs||[]; if(!arr.length) return {avgSpec:0,avgCulture:0}; const avg=(key)=>Math.round(arr.reduce((s,x)=>s+(Number(x[key])||0),0)/arr.length); return {avgSpec:avg('spec'),avgCulture:avg('culture')}; }
function renderSidebar(){
  const sidebar=document.getElementById('sidebar');
  sidebar.innerHTML=`<div class="brand"><small>Sports Recruit System</small><h1>体育单招系统 v3</h1><div class="maker">GitHub Pages 正式包 · 无登录门槛 · 本地保存</div></div>${Object.entries(VIEW_LABELS).map(([k,v])=>`<button class="nav-btn ${state.activeView===k?'active':''}" onclick="setView('${k}')">${v}</button>`).join('')}<div class="footer-note" style="margin-top:12px;padding:12px 14px;border-top:1px solid var(--line)">这版把上一包的会员锁和单文件结构改成了可直接上传 GitHub Pages 的正式静态站点。</div>`;
}
function renderHero(title,desc,badges=[]){
  const correct=countCorrect(); const sims=simulationStats();
  return `<section class="card hero"><div class="badge">GitHub Pages Ready</div><h2>${title}</h2><p>${desc}</p><div class="hero-meta">${badges.map(x=>`<span class="badge">${x}</span>`).join('')}</div><div class="stats"><div class="stat"><strong>${daysToExam()}</strong><span>距目标日期</span></div><div class="stat"><strong>${completedDaily()}/5</strong><span>今日执行</span></div><div class="stat"><strong>${state.colleges.length}</strong><span>报考条目</span></div><div class="stat"><strong>${correct.rate}%</strong><span>文化正确率</span></div><div class="stat"><strong>${sims.avgCulture}</strong><span>文化均分</span></div></div></section>`;
}
function roadmapPanel(stage){
  if(stage==='phases') return `<div class="grid-2">${ROADMAP_PHASES.map(p=>`<div class="block"><strong>${p.title}</strong><div class="small" style="margin-top:8px;line-height:1.85">${p.goal}</div><ul class="list" style="margin-top:10px">${p.items.map(i=>`<li>${i}</li>`).join('')}</ul></div>`).join('')}</div>`;
  if(stage==='checklist') return `<table class="table"><thead><tr><th>模块</th><th>要完成的动作</th></tr></thead><tbody>${ROADMAP_CHECKLIST.map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</tbody></table>`;
  if(stage==='week') return `<div class="grid-3">${WEEK_PLAN.map(item=>`<div class="block"><strong>${item.day}</strong><div class="small" style="margin-top:8px;line-height:1.85">上午：${item.am}<br>下午：${item.pm}<br>晚上：${item.night}</div></div>`).join('')}</div>`;
  return `<div class="grid-3"><div class="card"><h3>系统升级方向</h3><div class="subtitle">把单招系统从“只刷题”升级成“报考定位 + 专项训练 + 文化课 + 写作路由”的总控台。</div><ul class="list" style="margin-top:12px"><li>先定院校梯队与专项 baseline，再安排训练与文化节奏。</li><li>每天只盯住 1 个专项主任务 + 1 个语文主任务，避免双线都做散。</li><li>写作不再死套一篇，而是从 6 条路径里快速判主模块。</li></ul></div><div class="card"><h3>当前最该做的事</h3><div class="subtitle">先把不确定的大事变成确定的小清单。</div><div class="block" style="margin-top:12px;line-height:1.85"><div>① 今天把院校梯队和专项现状写成一页纸。</div><div>② 今天至少完成 1 个语文模块并留下错因。</div><div>③ 今天做 1 次作文路径速判，不拖到周末才想写作。</div></div></div><div class="card"><h3>今日执行单</h3><div class="subtitle">真正把系统跑起来的是每天的完成动作。</div><ul class="list" style="margin-top:12px">${DAILY_EXEC.map(x=>`<li>${x}</li>`).join('')}</ul></div></div><div class="card" style="margin-top:20px"><h3>12 周推进总图</h3><div class="subtitle">你不是同时完成所有事，而是在不同阶段换不同主任务。</div><div class="grid-2" style="margin-top:14px">${ROADMAP_PHASES.map(p=>`<div class="block"><strong>${p.title}</strong><div class="small" style="margin-top:8px;line-height:1.85">${p.goal}</div></div>`).join('')}</div></div>`;
}
function renderDashboard(){
  const correct=countCorrect(); const sims=simulationStats();
  return `${renderHero('体育单招系统：专项、文化、报考、写作四线并行','这版把上一包里不适合公开部署的登录壳和单文件交付换成了真正可上 GitHub Pages 的静态系统。你可以直接在这里管理专项基线、文化快练、作文六路径、报考信息和模拟复盘。',['无登录门槛','本地保存','GitHub Pages 可直接部署'])}
  <section class="grid-3">
    <div class="card"><h3>今日主任务</h3><div class="subtitle">别同时追 8 件事，只抓今天最该完成的 3 件。</div><ul class="list" style="margin-top:12px"><li>专项：只设 1 个主任务，别把训练写成口号。</li><li>文化：只做 1 个模块，做完必须留下错因。</li><li>写作：只做 1 次路径速判，把主模块先定清。</li></ul></div>
    <div class="card"><h3>双线推进雷达</h3><div class="subtitle">数字不是为了焦虑，而是为了知道哪里要补。</div><div class="metric-grid"><div class="metric-card"><strong>${completedWeekly()}/7</strong><span class="small">本周计划打卡</span></div><div class="metric-card"><strong>${correct.answered}</strong><span class="small">已做文化题</span></div><div class="metric-card"><strong>${sims.avgSpec}</strong><span class="small">专项均分</span></div><div class="metric-card"><strong>${sims.avgCulture}</strong><span class="small">文化均分</span></div></div></div>
    <div class="card"><h3>最快入口</h3><div class="subtitle">先决定你现在最缺什么，再点进去。</div><div class="row" style="margin-top:12px"><button class="pill" onclick="setView('roadmap')">看 12 周路线</button><button class="pill" onclick="setView('training')">填专项基线</button><button class="pill" onclick="setView('culture')">做文化快练</button><button class="pill" onclick="setView('writing')">开作文路由</button><button class="pill" onclick="setView('application')">录报考清单</button></div></div>
  </section>
  <section class="grid-main">
    <div class="card"><h3>备考路线总控</h3><div class="subtitle">先定目标，再分阶段推进；先把每天要做什么做实，再谈“全面提升”。</div><div class="toolbar"><button class="pill ${state.roadmapStage!=='phases'&&state.roadmapStage!=='checklist'&&state.roadmapStage!=='week'?'active':''}" onclick="setRoadmapStage('overview')">总控视图</button><button class="pill ${state.roadmapStage==='phases'?'active':''}" onclick="setRoadmapStage('phases')">12 周推进</button><button class="pill ${state.roadmapStage==='checklist'?'active':''}" onclick="setRoadmapStage('checklist')">报考清单</button><button class="pill ${state.roadmapStage==='week'?'active':''}" onclick="setRoadmapStage('week')">周计划</button></div><div style="margin-top:16px">${roadmapPanel(state.roadmapStage||'overview')}</div></div>
    <div class="card"><h3>今日执行勾选</h3><div class="subtitle">系统要靠打勾落地，而不是靠收藏。</div><div class="check-grid">${DAILY_EXEC.map((item,idx)=>`<label class="check-item"><input type="checkbox" ${state.dailyChecks[idx]?'checked':''} onchange="toggleDaily(${idx})"><span>${item}</span></label>`).join('')}</div><div class="block good" style="margin-top:14px">建议：睡前只看规则和提纲，不要大量刷新题，避免节奏乱掉。</div></div>
  </section>`;
}
function renderRoadmap(){
  return `${renderHero('备考路线：先总控，再推进','这一页把 12 周推进、报考清单、每周模板和今日执行都放到一起，避免你把大事拆不下来。',['12 周路线','报考清单','周计划'])}<section class="card"><h3>路线面板</h3><div class="toolbar"><button class="pill ${state.roadmapStage!=='phases'&&state.roadmapStage!=='checklist'&&state.roadmapStage!=='week'?'active':''}" onclick="setRoadmapStage('overview')">总控视图</button><button class="pill ${state.roadmapStage==='phases'?'active':''}" onclick="setRoadmapStage('phases')">12 周推进</button><button class="pill ${state.roadmapStage==='checklist'?'active':''}" onclick="setRoadmapStage('checklist')">报考清单</button><button class="pill ${state.roadmapStage==='week'?'active':''}" onclick="setRoadmapStage('week')">周计划</button></div><div style="margin-top:16px">${roadmapPanel(state.roadmapStage||'overview')}</div></section>`;
}
function renderTraining(){
  return `${renderHero('专项训练：把 baseline、周计划和恢复真正记下来','不要只凭体感说“最近状态还行”。把专项指标、周计划打卡和恢复提醒记下来，才知道下一步怎么调。',['专项 baseline','周计划打卡','恢复提醒'])}<section class="grid-2"><div class="card"><div class="space-between"><div><h3>专项 baseline</h3><div class="subtitle">当前值和目标值都可以直接修改，建议至少保留 4 个核心指标。</div></div><button class="btn secondary" onclick="addMetric()">新增指标</button></div><table class="table" style="margin-top:14px"><thead><tr><th>指标</th><th>当前</th><th>目标</th><th>备注</th><th></th></tr></thead><tbody>${state.trainingMetrics.map((m,idx)=>`<tr><td><input class="input" value="${escapeHtml(m.name)}" onchange="updateMetric(${idx},'name',this.value)"></td><td><input class="input" value="${escapeHtml(m.current)}" onchange="updateMetric(${idx},'current',this.value)"></td><td><input class="input" value="${escapeHtml(m.target)}" onchange="updateMetric(${idx},'target',this.value)"></td><td><input class="input" value="${escapeHtml(m.status)}" onchange="updateMetric(${idx},'status',this.value)"></td><td><button class="btn danger" onclick="removeMetric(${idx})">删</button></td></tr>`).join('')}</tbody></table></div><div class="card"><h3>恢复与执行提醒</h3><div class="subtitle">专项训练不是只会加码，也要看恢复和稳定性。</div><div class="check-grid">${['睡眠到位','训练后拉伸','补水补能量','伤痛有记录','动作没有大改','第二天安排清楚'].map((item,idx)=>`<label class="check-item"><input type="checkbox" ${state.recoveryChecks&&state.recoveryChecks[idx]?'checked':''} onchange="toggleRecovery(${idx})"><span>${item}</span></label>`).join('')}</div><div class="block warn" style="margin-top:14px">考前阶段的重点是“稳住熟节奏”，不是临时大改动作。</div></div></section><section class="card"><h3>一周专项 + 文化固定槽位</h3><div class="subtitle">真正稳定的同学，通常都有固定槽位，而不是临时想起什么做什么。</div><div class="grid-3" style="margin-top:14px">${WEEK_PLAN.map((item,idx)=>`<div class="block"><div class="space-between"><strong>${item.day}</strong><input type="checkbox" ${state.weeklyChecks[idx]?'checked':''} onchange="toggleWeekly(${idx})"></div><div class="small" style="margin-top:8px;line-height:1.85">上午：${item.am}<br>下午：${item.pm}<br>晚上：${item.night}</div></div>`).join('')}</div></section>`;
}
function cultureList(){
  let list=CULTURE_BANK.slice();
  if(state.cultureFilter!=='all') list=list.filter(q=>q.cat===state.cultureFilter);
  if(state.cultureOnlyWrong) list=list.filter(q=>{const r=state.drillRecords[q.id]; return r && r.answered && !r.correct;});
  if(state.cultureOnlyFav) list=list.filter(q=>state.drillRecords[q.id] && state.drillRecords[q.id].favorite);
  if(!list.some(q=>q.id===state.cultureCurrentId) && list[0]) state.cultureCurrentId=list[0].id;
  return list;
}
function renderCulture(){
  const list=cultureList(); const current=list.find(q=>q.id===state.cultureCurrentId) || list[0] || CULTURE_BANK[0];
  const rec=state.drillRecords[current.id]||{}; const correct=countCorrect();
  return `${renderHero('文化快练：先守住底线，再提稳定性','这一页不是大而散的题海，而是单招文化线最需要的“基础语用 + 阅读方法 + 写作路由”稳分组合。',['错题优先','收藏回看','本地记录'])}<section class="card"><div class="space-between"><div><h3>快练面板</h3><div class="subtitle">先做稳题，再做提升题；先留下错因，再谈刷题量。</div></div><div class="row"><select onchange="setCultureFilter(this.value)"><option value="all" ${state.cultureFilter==='all'?'selected':''}>全部分类</option><option value="基础语用" ${state.cultureFilter==='基础语用'?'selected':''}>基础语用</option><option value="阅读方法" ${state.cultureFilter==='阅读方法'?'selected':''}>阅读方法</option><option value="古诗文" ${state.cultureFilter==='古诗文'?'selected':''}>古诗文</option><option value="写作路由" ${state.cultureFilter==='写作路由'?'selected':''}>写作路由</option></select><button class="pill ${state.cultureOnlyWrong?'active':''}" onclick="toggleCultureWrong()">错题优先</button><button class="pill ${state.cultureOnlyFav?'active':''}" onclick="toggleCultureFav()">只看收藏</button></div></div><div class="toolbar"><span class="count-badge">${list.length}</span><span class="small">已做 ${correct.answered} 题，正确率 ${correct.rate}%</span></div><div class="question-shell"><div class="question-list">${list.map((q,idx)=>{const r=state.drillRecords[q.id]||{}; return `<button class="question-item ${q.id===current.id?'active':''}" onclick="openCultureQuestion('${q.id}')"><strong>${idx+1}. ${q.stem.replace(/（.*?）/,'')}</strong><div class="meta"><span class="tag">${q.cat}</span><span class="tag">${q.difficulty}</span>${r.answered?`<span class="tag" style="background:${r.correct?'#ecfdf3':'#fff1f2'};color:${r.correct?'#1d5b35':'#8b1e3f'}">${r.correct?'已对':'待复盘'}</span>`:''}${r.favorite?'<span class="tag">★ 收藏</span>':''}</div></button>`;}).join('')}</div><div class="card"><div class="space-between"><div><h3>${current.cat} · ${current.difficulty}</h3><div class="subtitle">${current.tip}</div></div><button class="pill ${rec.favorite?'active':''}" onclick="toggleQuestionFavorite('${current.id}')">${rec.favorite?'已收藏':'收藏本题'}</button></div><div style="margin-top:14px;font-size:18px;line-height:1.9;white-space:pre-line">${current.stem}</div>${current.options.map((op,idx)=>{const answered=rec.answered; let cls=''; if(answered && idx===current.answer) cls='correct'; if(answered && rec.answer===idx && rec.answer!==current.answer) cls='wrong'; if(!answered && rec.answer===idx) cls='active'; return `<button class="option ${cls}" onclick="answerCulture('${current.id}',${idx})"><span class="opt-code">${String.fromCharCode(65+idx)}</span><span>${op}</span></button>`;}).join('')}<div class="block ${rec.answered?(rec.correct?'good':'bad'):'warn'}" style="margin-top:14px"><strong>${rec.answered?(rec.correct?'本题答对：':'本题待复盘：'):'做题提醒：'}</strong><div class="small" style="margin-top:8px;line-height:1.85">${rec.answered?current.analysis:'先看主干、对象或主模块，不要一上来靠耳感和脸熟。'}</div></div></div></div></section>`;
}
function routeOutput(route, material){
  const summary=(material||'训练、文化、技术与人的关系').trim() || '训练、文化、技术与人的关系';
  const r=WRITING_ROUTES.find(x=>x.id===route) || WRITING_ROUTES[1];
  const second=(r.name.split(' → ')[1]||'补位因素');
  const third=(r.name.split(' → ')[2]||'抬升因素');
  return `标题建议：先把“${r.focus==='all'?'主问题':r.focus}”写深，再谈系统补位

开头定位：从“${summary}”看，问题首先不只是表面成绩或技术选择，更关乎${r.focus==='all'?'主问题的辨认':r.focus+'如何成为破局起点'}。

分论点一（主模块）：先写${r.name.split(' → ')[0]}。解释为什么它是材料的第一落点，写深，不要平均用力。

分论点二（补位模块）：再写${second}。说明第一模块为什么还不够，必须补上这一层，问题才真正进入解决轨道。

分论点三（抬升模块）：最后写${third}。把文章从“会做题/会训练”抬到“有系统、有边界、有人的位置”。

结尾收束：真正高分的关键，不是把三点都写到，而是先把主模块写深，再让后两环补位与抬升。`;
}
function renderWriting(){
  const routeId=state.writingRoute||'all'; const routes=(routeId==='all'?WRITING_ROUTES.slice(1):WRITING_ROUTES.filter(x=>x.id===routeId));
  return `${renderHero('作文六路径：先判主模块，再让后两环补位','高分不是“把三点都写到”，而是“第一模块写深，后两模块写成补位与抬升”。这一页把你最常用的 6 条单招作文路线单独拆出来。',['六路径速判','骨架生成','本地保存'])}<section class="card"><div class="space-between"><div><h3>路线选择</h3><div class="subtitle">先看材料主问题落在人、系统还是技术，再决定谁写在前面。</div></div></div><div class="toolbar">${WRITING_ROUTES.map(r=>`<button class="pill ${routeId===r.id?'active':''}" onclick="setWritingRoute('${r.id}')">${r.name}</button>`).join('')}</div><div class="route-grid">${routes.map(r=>`<div class="route-card ${routeId===r.id?'active':''}"><strong>${r.name}</strong><div class="small" style="margin-top:8px;line-height:1.85">适用：${r.use}<br>易错：${r.risk}<br>衔接句：${r.bridge}</div></div>`).join('')}</div></section><section class="grid-main"><div class="card"><h3>材料翻译器</h3><div class="subtitle">把材料先翻成自己的话，再生成三段骨架。这里不是 AI 自动作文，而是给你一个稳骨架。</div><textarea class="textarea" placeholder="把材料核心意思用 1-3 句话写在这里……" oninput="updateWritingMaterial(this.value)">${escapeHtml(state.writingMaterial||'')}</textarea><div class="row" style="margin-top:12px"><button class="btn" onclick="generateWritingDraft()">生成三段骨架</button><button class="btn secondary" onclick="copyWritingDraft()">复制骨架</button></div></div><div class="card"><h3>当前输出</h3><div class="subtitle">先写主模块，再写补位模块，最后写抬升模块。</div><div id="writingOutput" style="white-space:pre-wrap;line-height:1.9;margin-top:12px">${escapeHtml(routeOutput(routeId==='all'?'r1':routeId, state.writingMaterial||''))}</div></div></section>`;
}
function applicationStats(){ const total=state.colleges.length; const confirmed=state.colleges.filter(x=>x.status==='已确认').length; return {total,confirmed}; }
function renderApplication(){ const stats=applicationStats();
  return `${renderHero('报考管理：别把系统性工作拖到最后','真正拖后腿的，往往不是不会练，而是定位、流程和资料混乱。这一页不预设任何实时院校数据，你自己按 2026 招生简章填进去就行。',['可自填院校清单','不预置过时数据','本地可导出'])}<section class="grid-2"><div class="card"><h3>新增报考条目</h3><div class="subtitle">建议至少保留冲刺 / 主报 / 保底三层。</div><div class="grid-2" style="margin-top:14px"><input class="input" id="collegeSchool" placeholder="院校名称"><input class="input" id="collegeSport" placeholder="专项项目"><select id="collegeTier"><option>冲刺</option><option selected>主报</option><option>保底</option></select><select id="collegeStatus"><option selected>待确认</option><option>跟进中</option><option>已确认</option></select><input class="input" id="collegeSpec" placeholder="专项要求 / 分数"><input class="input" id="collegeCulture" placeholder="文化要求 / 分数"></div><textarea class="textarea" id="collegeNote" placeholder="备注：证件、报名时间、材料、简章链接记录……"></textarea><div class="row" style="margin-top:12px"><button class="btn" onclick="addCollege()">添加条目</button></div></div><div class="card"><h3>清单概览</h3><div class="subtitle">先有清单，再谈判断。</div><div class="metric-grid"><div class="metric-card"><strong>${stats.total}</strong><span class="small">总条目</span></div><div class="metric-card"><strong>${stats.confirmed}</strong><span class="small">已确认</span></div><div class="metric-card"><strong>${state.colleges.filter(x=>x.tier==='冲刺').length}</strong><span class="small">冲刺</span></div><div class="metric-card"><strong>${state.colleges.filter(x=>x.tier==='保底').length}</strong><span class="small">保底</span></div></div><div class="block warn" style="margin-top:14px">提醒：这套系统不内置院校分数线，避免给你过时信息。请按最新招生简章手动录入。</div></div></section><section class="card"><h3>报考表</h3><div class="subtitle">所有内容都可以直接改，改完会自动本地保存。</div><table class="table" style="margin-top:14px"><thead><tr><th>院校</th><th>专项</th><th>层级</th><th>专项要求</th><th>文化要求</th><th>状态</th><th>备注</th><th></th></tr></thead><tbody>${state.colleges.map((c,idx)=>`<tr><td><input class="input" value="${escapeHtml(c.school)}" onchange="updateCollege(${idx},'school',this.value)"></td><td><input class="input" value="${escapeHtml(c.sport)}" onchange="updateCollege(${idx},'sport',this.value)"></td><td><select onchange="updateCollege(${idx},'tier',this.value)"><option ${c.tier==='冲刺'?'selected':''}>冲刺</option><option ${c.tier==='主报'?'selected':''}>主报</option><option ${c.tier==='保底'?'selected':''}>保底</option></select></td><td><input class="input" value="${escapeHtml(c.spec)}" onchange="updateCollege(${idx},'spec',this.value)"></td><td><input class="input" value="${escapeHtml(c.culture)}" onchange="updateCollege(${idx},'culture',this.value)"></td><td><select onchange="updateCollege(${idx},'status',this.value)"><option ${c.status==='待确认'?'selected':''}>待确认</option><option ${c.status==='跟进中'?'selected':''}>跟进中</option><option ${c.status==='已确认'?'selected':''}>已确认</option></select></td><td><textarea class="textarea" style="min-height:90px" onchange="updateCollege(${idx},'note',this.value)">${escapeHtml(c.note)}</textarea></td><td><button class="btn danger" onclick="deleteCollege(${idx})">删</button></td></tr>`).join('')}</tbody></table></section>`;
}
function renderReview(){ const sims=simulationStats();
  return `${renderHero('模拟复盘：分数只是入口，下一步动作才是关键','专项模拟、文化模拟和心态记录都应该落成可复盘的条目，不要只停留在“今天感觉不太好”。',['新增模拟记录','自动算均分','下次动作提醒'])}<section class="grid-2"><div class="card"><h3>新增模拟记录</h3><div class="subtitle">每次模拟至少留下：分数、状态、下次调整动作。</div><div class="grid-2" style="margin-top:14px"><input class="input" id="simDate" type="date"><input class="input" id="simMood" placeholder="状态 / 心态"><input class="input" id="simSpec" placeholder="专项分 / 表现"><input class="input" id="simCulture" placeholder="文化分"></div><textarea class="textarea" id="simNote" placeholder="记录本次失误、节奏、下次修正动作……"></textarea><div class="row" style="margin-top:12px"><button class="btn" onclick="addSimulation()">添加记录</button></div></div><div class="card"><h3>统计快看</h3><div class="subtitle">不是为了焦虑，而是为了知道要补哪一块。</div><div class="metric-grid"><div class="metric-card"><strong>${state.simulationLogs.length}</strong><span class="small">模拟次数</span></div><div class="metric-card"><strong>${sims.avgSpec}</strong><span class="small">专项均分</span></div><div class="metric-card"><strong>${sims.avgCulture}</strong><span class="small">文化均分</span></div><div class="metric-card"><strong>${state.simulationLogs.slice(-1)[0]?escapeHtml(state.simulationLogs.slice(-1)[0].mood||'—'):'—'}</strong><span class="small">最近状态</span></div></div></div></section><section class="card"><h3>复盘表</h3><div class="subtitle">下次怎么调，比这次多少分更重要。</div><table class="table" style="margin-top:14px"><thead><tr><th>日期</th><th>专项</th><th>文化</th><th>状态</th><th>复盘</th><th></th></tr></thead><tbody>${state.simulationLogs.map((s,idx)=>`<tr><td>${escapeHtml(s.date)}</td><td>${escapeHtml(s.spec)}</td><td>${escapeHtml(s.culture)}</td><td>${escapeHtml(s.mood)}</td><td style="white-space:pre-wrap">${escapeHtml(s.note)}</td><td><button class="btn danger" onclick="deleteSimulation(${idx})">删</button></td></tr>`).join('')}</tbody></table></section>`;
}
function renderData(){
  return `${renderHero('数据中心：导出、导入、重置都放在这里','这套系统默认只保存在当前浏览器。本页可以随时导出备份，也能导入回原来的状态。',['导出 JSON','导入 JSON','重置本地数据'])}<section class="grid-2"><div class="card"><h3>目标日期与备份</h3><div class="subtitle">可以在这里修改倒计时使用的目标日期。</div><div class="row" style="margin-top:12px"><input class="input" type="date" value="${state.examDate}" onchange="updateExamDate(this.value)" style="max-width:240px"></div><h3 style="margin-top:18px">备份与恢复</h3><div class="subtitle">建议每次大改报考清单或模拟记录后导出一次。</div><div class="row" style="margin-top:14px"><button class="btn" onclick="exportState()">导出 JSON 备份</button><button class="btn secondary" onclick="triggerImport()">导入 JSON 备份</button><button class="btn danger" onclick="resetAllData()">清空本地数据</button></div><div class="block warn" style="margin-top:14px">导入会覆盖当前数据，操作前建议先导出一份旧备份。</div></div><div class="card"><h3>自由备注</h3><div class="subtitle">把不想分散到各模块的内容暂时记在这里。</div><textarea class="textarea" oninput="updateNotes(this.value)">${escapeHtml(state.notes||'')}</textarea></div></section>`;
}
function renderApp(){
  renderSidebar();
  const app=document.getElementById('app');
  if(state.activeView==='roadmap') app.innerHTML=renderRoadmap();
  else if(state.activeView==='training') app.innerHTML=renderTraining();
  else if(state.activeView==='culture') app.innerHTML=renderCulture();
  else if(state.activeView==='writing') app.innerHTML=renderWriting();
  else if(state.activeView==='application') app.innerHTML=renderApplication();
  else if(state.activeView==='review') app.innerHTML=renderReview();
  else if(state.activeView==='data') app.innerHTML=renderData();
  else app.innerHTML=renderDashboard();
}
function setView(v){ state.activeView=v; saveState(); renderApp(); }
function setRoadmapStage(v){ state.roadmapStage=v; saveState(); renderApp(); }
function toggleDaily(idx){ state.dailyChecks[idx]=!state.dailyChecks[idx]; saveState(); renderApp(); }
function toggleWeekly(idx){ state.weeklyChecks[idx]=!state.weeklyChecks[idx]; saveState(); renderApp(); }
function toggleRecovery(idx){ if(!state.recoveryChecks) state.recoveryChecks={}; state.recoveryChecks[idx]=!state.recoveryChecks[idx]; saveState(); renderApp(); }
function addMetric(){ state.trainingMetrics.push({name:'新指标',current:'',target:'',status:''}); saveState(); renderApp(); }
function updateMetric(idx,key,val){ state.trainingMetrics[idx][key]=val; saveState(); }
function removeMetric(idx){ state.trainingMetrics.splice(idx,1); saveState(); renderApp(); }
function setCultureFilter(v){ state.cultureFilter=v; saveState(); renderApp(); }
function toggleCultureWrong(){ state.cultureOnlyWrong=!state.cultureOnlyWrong; saveState(); renderApp(); }
function toggleCultureFav(){ state.cultureOnlyFav=!state.cultureOnlyFav; saveState(); renderApp(); }
function openCultureQuestion(id){ state.cultureCurrentId=id; saveState(); renderApp(); }
function answerCulture(id, idx){ const q=CULTURE_BANK.find(x=>x.id===id); if(!q) return; const r=state.drillRecords[id]||{}; r.answer=idx; r.answered=true; r.correct=idx===q.answer; r.wrongCount=(r.wrongCount||0)+(r.correct?0:1); r.lastAt=Date.now(); state.drillRecords[id]=r; saveState(); renderApp(); showToast(r.correct?'答对了':'已记录错因，记得复盘'); }
function toggleQuestionFavorite(id){ const r=state.drillRecords[id]||{}; r.favorite=!r.favorite; state.drillRecords[id]=r; saveState(); renderApp(); }
function setWritingRoute(id){ state.writingRoute=id; saveState(); renderApp(); }
function updateWritingMaterial(v){ state.writingMaterial=v; saveState(); }
function generateWritingDraft(){ const out=document.getElementById('writingOutput'); if(out) out.textContent=routeOutput(state.writingRoute==='all'?'r1':state.writingRoute, state.writingMaterial||''); showToast('已生成三段骨架'); }
function copyWritingDraft(){ const text=routeOutput(state.writingRoute==='all'?'r1':state.writingRoute, state.writingMaterial||''); if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(()=>showToast('已复制骨架')); } else { showToast('当前环境不支持直接复制'); } }
function addCollege(){ const school=document.getElementById('collegeSchool').value.trim(); const sport=document.getElementById('collegeSport').value.trim(); const tier=document.getElementById('collegeTier').value; const status=document.getElementById('collegeStatus').value; const spec=document.getElementById('collegeSpec').value.trim(); const culture=document.getElementById('collegeCulture').value.trim(); const note=document.getElementById('collegeNote').value.trim(); state.colleges.push({school,sport,tier,status,spec,culture,note}); saveState(); renderApp(); showToast('已添加报考条目'); }
function updateCollege(idx,key,val){ state.colleges[idx][key]=val; saveState(); }
function deleteCollege(idx){ state.colleges.splice(idx,1); saveState(); renderApp(); }
function addSimulation(){ const date=document.getElementById('simDate').value||new Date().toISOString().slice(0,10); const mood=document.getElementById('simMood').value.trim(); const spec=document.getElementById('simSpec').value.trim(); const culture=document.getElementById('simCulture').value.trim(); const note=document.getElementById('simNote').value.trim(); state.simulationLogs.unshift({date,mood,spec,culture,note}); saveState(); renderApp(); showToast('已记录模拟复盘'); }
function deleteSimulation(idx){ state.simulationLogs.splice(idx,1); saveState(); renderApp(); }
function updateNotes(v){ state.notes=v; saveState(); }
function updateExamDate(v){ state.examDate=v; saveState(); renderApp(); }
function exportState(){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='sports_recruit_system_v3_backup.json'; a.click(); URL.revokeObjectURL(a.href); }
function triggerImport(){ document.getElementById('importFile').click(); }
function importStateFile(e){ const file=e.target.files && e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=()=>{ try{ state=hydrateState(JSON.parse(reader.result)); saveState(); renderApp(); showToast('已导入备份'); }catch(err){ alert('备份文件读取失败'); } e.target.value=''; }; reader.readAsText(file,'utf-8'); }
function resetAllData(){ if(!confirm('确定清空当前浏览器中的全部体育单招系统数据吗？')) return; state=clone(DEFAULT_STATE); saveState(); renderApp(); showToast('已清空本地数据'); }
window.setView=setView; window.setRoadmapStage=setRoadmapStage; window.updateExamDate=updateExamDate; window.toggleDaily=toggleDaily; window.toggleWeekly=toggleWeekly; window.toggleRecovery=toggleRecovery; window.addMetric=addMetric; window.updateMetric=updateMetric; window.removeMetric=removeMetric; window.setCultureFilter=setCultureFilter; window.toggleCultureWrong=toggleCultureWrong; window.toggleCultureFav=toggleCultureFav; window.openCultureQuestion=openCultureQuestion; window.answerCulture=answerCulture; window.toggleQuestionFavorite=toggleQuestionFavorite; window.setWritingRoute=setWritingRoute; window.updateWritingMaterial=updateWritingMaterial; window.generateWritingDraft=generateWritingDraft; window.copyWritingDraft=copyWritingDraft; window.addCollege=addCollege; window.updateCollege=updateCollege; window.deleteCollege=deleteCollege; window.addSimulation=addSimulation; window.deleteSimulation=deleteSimulation; window.exportState=exportState; window.triggerImport=triggerImport; window.importStateFile=importStateFile; window.resetAllData=resetAllData; window.updateNotes=updateNotes;
document.getElementById('importFile').addEventListener('change', importStateFile);
if(document.readyState!=='loading') renderApp(); else document.addEventListener('DOMContentLoaded', renderApp);

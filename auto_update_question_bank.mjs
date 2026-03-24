import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const INDEX_PATH = 'index.html';
const STATE_PATH = '.auto_update_state.json';
const SOURCES_PATH = 'update_sources.json';
const keyB64 = process.env.SITE_CONTENT_KEY_B64;
if(!keyB64){
  throw new Error('Missing SITE_CONTENT_KEY_B64 secret.');
}
const key = Buffer.from(keyB64, 'base64');

function cleanText(raw){
  return String(raw || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
function splitSentences(text){
  const cleaned = cleanText(text).replace(/\n+/g, '。');
  const pieces = cleaned.match(/[^。！？!?；;]+[。！？!?；;]?/g) || [];
  return pieces.map(s => s.trim()).filter(Boolean);
}
function collectKeywords(text, title){
  const raw = `${title || ''}${cleanText(text)}`;
  const hits = raw.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
  const stop = new Set(['我们','你们','他们','这个','这些','那个','一种','已经','因为','所以','如果','不是','还有','自己','需要','可以','以及','进行','应该','一个','一些','没有','更加','什么','如何','对于','之后','之前','真正','问题','文章','材料','主题','时候','事情','大家','目前','可能','通过','看到','仍然','继续','有关','最新']);
  const counter = new Map();
  for(const word of hits){
    if(stop.has(word)) continue;
    counter.set(word, (counter.get(word) || 0) + 1);
  }
  return [...counter.entries()].sort((a,b) => b[1] - a[1]).slice(0,3).map(x => x[0]);
}
const ROUTES = [
  { name:'人工智能辅助学习的边界', keywords:['人工智能','智能','算法','模型','AI','数字','数据','平台'], route:['目标澄清','能力判断','过程监督','伦理边界'], tags:['人工智能','学习方法'] },
  { name:'训练与成长', keywords:['训练','运动','体育','比赛','体能','恢复','复盘','耐力','课堂训练'], route:['目标校准','训练分层','反馈修正','长期坚持'], tags:['训练成长','体育学习'] },
  { name:'公共服务与治理', keywords:['公共','城市','治理','社区','服务','改革','制度','管理','学校','校园'], route:['问题识别','规则完善','协同执行','长期评估'], tags:['公共议题','制度思考'] },
  { name:'团队协作', keywords:['团队','合作','协作','班级','组织','沟通','分工','共识'], route:['差异承认','目标对齐','规则协作','结果复盘'], tags:['团队协作','组织表达'] },
  { name:'综合议题', keywords:[], route:['问题识别','路径展开','协同落实','长期检验'], tags:['综合表达','逻辑强化'] }
];
function inferTemplate(title, text){
  const corpus = `${title || ''} ${cleanText(text)}`.toLowerCase();
  let best = ROUTES[ROUTES.length - 1];
  let score = -1;
  for(const item of ROUTES){
    let s = 0;
    for(const word of item.keywords){
      const m = corpus.match(new RegExp(word.toLowerCase(), 'g'));
      if(m) s += m.length;
    }
    if(s > score){ best = item; score = s; }
  }
  return best;
}
function buildPassage(theme, keywords, route){
  const focus = (keywords || []).slice(0,3).join('、') || theme;
  return `围绕“${theme}”的材料，表面上谈的是${focus}等现象，深层上更在追问：问题从哪里开始、路径如何展开、协同机制怎样补齐，以及最后能否形成经得起长期检验的稳定改进。真正有效的分析，不是摘一句热词就下判断，而是沿着“${route.join('—')}”逐层推进。`;
}
function makeId(prefix){
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}
function shuffleQuestion(item){
  const bag = item.options.map((opt, idx) => ({ opt, correct: idx === item.answer }));
  for(let i = bag.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  item.options = bag.map(x => x.opt);
  item.answer = bag.findIndex(x => x.correct);
  return item;
}
function buildSeed(title, source, text){
  const template = inferTemplate(title, text);
  const keywords = collectKeywords(text, title);
  return {
    title: title || template.name,
    source: source || '自动抓取',
    text,
    keywords,
    route: template.route.slice(),
    routeLabel: template.route.join('—'),
    tags: template.tags.concat(['自动更新','原创改写']),
    passage: buildPassage(title || template.name, keywords, template.route)
  };
}
function buildModernPack(seed){
  const { title, route, routeLabel, passage } = seed;
  const theme = title;
  const tags = seed.tags.slice().concat(['高阶干扰项']);
  const list = [
    {
      id: makeId('modern-auto'),
      stem: '下列对文段论述重心概括最恰当的一项是',
      options: [
        `围绕“${theme}”的讨论，不能只看表层结果，而要沿着“${routeLabel}”把问题起点、推进路径和长期检验连成一条链`,
        `文段认为只要速度足够快，关于“${theme}”的其他问题都会在执行中自行消失`,
        `作者主要想说明与其分析“${theme}”，不如暂时搁置所有判断，避免犯错`,
        `文章把重心放在情绪宣泄上，而不是放在分析顺序与判断边界上`
      ],
      answer: 0,
      analysis: '文段不是单点表态，而是在组织一条完整的判断路径。',
      knowledge: ['现代文先判文本重心，再审干扰项有没有偷换对象、缩小范围或夸大程度。','主旨题要回到全文，不要只抓一句顺耳的话。'],
      tags, title, genre:'论述类', passage, difficulty:'advanced'
    },
    {
      id: makeId('modern-auto'),
      stem: '根据文段，下列推断不恰当的一项是',
      options: [
        `若问题起点判断失准，后面的“${route[1]}”和“${route[2]}”也容易流于表面`,
        `只追短期见效而不校准规则边界，往往会把旧问题换个位置继续存在`,
        `只要先把结果做出来，关于“${theme}”的判断次序其实可以完全倒置，不影响最后成效`,
        `文段并不反对效率，而是反对脱离判断链条的单线冲刺`
      ],
      answer: 2,
      analysis: '错误项把判断顺序当成可随意跳过的步骤，这与原文强调的层层推进相违。',
      knowledge: ['推断题要看原文能不能真正支持这一步。','出现“只要……就……”这类过满表述时要特别警惕。'],
      tags, title, genre:'论述类', passage, difficulty:'advanced'
    },
    {
      id: makeId('modern-auto'),
      stem: '下列对文段论证层次的梳理，最恰当的一项是',
      options: [
        `先指出表层热度的不足，再补出“${routeLabel}”这一更稳定的判断顺序`,
        `先给出最终结论，再回头补写材料背景，最后完全否定前文问题意识`,
        `先罗列多个现象，再把它们并列堆叠，不区分先后主次`,
        `先把技术手段当成答案，再反向寻找能证明它正确的现象`
      ],
      answer: 0,
      analysis: '正确项抓住了文段常见的“先纠偏、后搭路径”的结构。',
      knowledge: ['分析层次时重点看“先说什么、后说什么、为什么这样排”。','如果几个选项都像在说方法，优先看它是否符合文段推进顺序。'],
      tags, title, genre:'论述类', passage, difficulty:'advanced'
    },
    {
      id: makeId('modern-auto'),
      stem: '下列对文段中关键判断的理解，最恰当的一项是',
      options: [
        `所谓“成熟的改进”，不是把“${theme}”包装得更热闹，而是让每一步都能和前后环节严密衔接`,
        `文段所谓“长期检验”，就是尽量拖延行动，把所有问题都留待将来处理`,
        `只要技术或工具足够新，关于“${theme}”的逻辑顺序可以让位于执行冲劲`,
        `作者认为任何协同都会削弱效率，因此最好的办法是单线推进`
      ],
      answer: 0,
      analysis: '正确理解抓住了“逻辑链”与“长期检验”两个关键词。',
      knowledge: ['关键句理解题不能只抓一个词，要把前后文连起来。','把抽象判断翻译回原文，看它具体对应哪一层意思。'],
      tags, title, genre:'论述类', passage, difficulty:'advanced'
    }
  ];
  return list.map(item => shuffleQuestion(item));
}
function buildSequenceItem(seed){
  const frags = [
    `先判断${seed.title}的问题究竟从哪里开始`,
    '再看表面调整为什么可能掩盖旧问题',
    '然后把责任、规则和反馈路径补齐',
    '最后从长期效果检验改进是否真正成立'
  ];
  return shuffleQuestion({
    id: makeId('sequence-auto'),
    stem: `将下列句子填入文中横线处，排序最恰当的一项是：\n①${frags[0]}。\n②${frags[1]}。\n③${frags[2]}。\n④${frags[3]}。`,
    options: ['①②③④', '①③②④', '②①③④', '②③①④'],
    answer: 0,
    analysis: '这组句子遵循“起点判断—误区辨析—路径补齐—长期检验”的递进顺序。',
    knowledge: ['排序题先看首句和尾句，再辨中间层次。','如果差别只在中间两句，往往比的是论证顺序。'],
    tags: seed.tags.slice().concat(['逻辑排序']),
    passage: `${seed.source}整理：围绕“${seed.title}”的材料，需要按逻辑顺序还原论证链。`,
    difficulty:'advanced'
  });
}
function buildWritingItem(seed){
  const material = cleanText(seed.text).slice(0, 120) || seed.passage.slice(0,120);
  return {
    id: makeId('writing-auto'),
    title: seed.title,
    material,
    pain: `${seed.title}的讨论容易停在表面热度、单点归因或情绪判断上。`,
    prompt: `阅读材料：${material}\n请围绕“${seed.title}”提炼中心论点，并写出一个不少于4步的议论文提纲。要求论证顺序贴合“${seed.routeLabel}”，分论点之间要有递进。`,
    thesis: `回应“${seed.title}”这一议题，不能只停在单点判断上，而应依照“${seed.routeLabel}”的逻辑展开：先辨明问题起点，再安排执行与协同，最后把短期应对转化为可持续的长期机制。`,
    bullets: [
      `先概括材料：${material} 表面上看是一个具体现象，更深层看是判断顺序、执行路径与协同机制没有理顺。`,
      `第一层写“${seed.route[0]}”：说明为什么这一环节必须先行。`,
      `第二层写“${seed.route[1]}”：指出只有看见起点还不够，还要把路径、标准与责任说清楚。`,
      `第三层写“${seed.route[2]}”：进一步说明如何把前两层落到制度、组织或日常实践中。`,
      `第四层写“${seed.route[3]}”：在前三层打底后，再谈长期效果、边界与持续改进。`,
      '结尾提升：成熟的论证，不在于堆砌热词，而在于让“先做什么、再做什么、为什么这样做”清晰可见。'
    ],
    checklist: [
      `总论点是否明确体现了“${seed.routeLabel}”这一逻辑链，而不是把关键词并列堆放？`,
      '分论点之间是否具有“起点—展开—落地—提升”的递进关系？',
      '是否既写到现实痛点，也写到规则、协同与长期机制？',
      '结尾是否完成价值提升，而不是简单重复材料原句？'
    ],
    tags: seed.tags.slice(),
    route: seed.route.slice(),
    routeLabel: seed.routeLabel,
    difficulty:'advanced'
  };
}
async function fetchText(url){
  const direct = url;
  const stripped = url.replace(/^https?:\/\//i, '');
  const backups = [direct, `https://r.jina.ai/http://${stripped}`];
  let lastError = '';
  for(const item of [...new Set(backups)]){
    try{
      const res = await fetch(item, { headers: { 'User-Agent': 'Mozilla/5.0 auto-update-question-bank' } });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const cleaned = cleanText(text);
      if(cleaned.length < 120) throw new Error('text too short');
      return cleaned;
    }catch(err){
      lastError = err?.message || String(err);
    }
  }
  throw new Error(lastError || 'fetch failed');
}
function parseRss(xmlText){
  const entries = [...xmlText.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<description><!\[CDATA\[(.*?)\]\]><\/description>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/g)];
  if(!entries.length) return [];
  return entries.slice(0, 5).map(m => ({ title: cleanText(m[1]), text: cleanText(m[2]), link: cleanText(m[3]) }));
}
async function loadState(){
  try{ return JSON.parse(await fs.readFile(STATE_PATH, 'utf8')); }catch{ return { seen: {} }; }
}
function hashSource(name, title, text){
  return crypto.createHash('sha256').update(`${name}\n${title}\n${text.slice(0, 800)}`).digest('hex');
}
function decryptContent(html){
  const match = html.match(/const SEALED_CONTENT = (\{[\s\S]*?\});/);
  if(!match) throw new Error('SEALED_CONTENT not found');
  const sealed = JSON.parse(match[1]);
  const iv = Buffer.from(sealed.iv, 'base64');
  const raw = Buffer.from(sealed.cipher, 'base64');
  const tag = raw.subarray(raw.length - 16);
  const data = raw.subarray(0, raw.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8'));
}
function encryptContent(obj){
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plain = Buffer.from(JSON.stringify(obj));
  const data = Buffer.concat([cipher.update(plain), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { alg:'AES-GCM', iv: iv.toString('base64'), cipher: Buffer.concat([data, tag]).toString('base64'), format:'merged-banks-v1' };
}
function replaceSealed(html, sealed){
  return html.replace(/const SEALED_CONTENT = \{[\s\S]*?\};/, `const SEALED_CONTENT = ${JSON.stringify(sealed)};`);
}
function ensureBank(data, key, label){
  if(!data.banks[key]) data.banks[key] = { label, items: [] };
  if(!Array.isArray(data.banks[key].items)) data.banks[key].items = [];
}
async function main(){
  const html = await fs.readFile(INDEX_PATH, 'utf8');
  const data = decryptContent(html);
  ensureBank(data, 'modern', '现代文');
  ensureBank(data, 'sequence', '衔接排序');
  ensureBank(data, 'writing', '写作');
  const sourceConfig = JSON.parse(await fs.readFile(SOURCES_PATH, 'utf8'));
  const state = await loadState();
  let changed = false;
  for(const source of sourceConfig.sources || []){
    if(source.type === 'rss'){
      const rss = await fetchText(source.url);
      const items = parseRss(rss);
      for(const item of items){
        const hash = hashSource(source.name, item.title, item.text);
        if(state.seen[hash]) continue;
        const seed = buildSeed(item.title || source.name, source.name, item.text);
        const pack = {
          modern: buildModernPack(seed),
          sequence: [buildSequenceItem(seed)],
          writing: [buildWritingItem(seed)]
        };
        for(const q of pack.modern){ data.banks.modern.items.push(q); }
        for(const q of pack.sequence){ data.banks.sequence.items.push(q); }
        for(const q of pack.writing){ data.banks.writing.items.push(q); }
        state.seen[hash] = { title: item.title, source: source.name, addedAt: new Date().toISOString() };
        changed = true;
      }
    }else if(source.type === 'url'){
      const text = await fetchText(source.url);
      const hash = hashSource(source.name, source.name, text);
      if(state.seen[hash]) continue;
      const seed = buildSeed(source.name, source.name, text);
      const pack = {
        modern: buildModernPack(seed),
        sequence: [buildSequenceItem(seed)],
        writing: [buildWritingItem(seed)]
      };
      for(const q of pack.modern){ data.banks.modern.items.push(q); }
      for(const q of pack.sequence){ data.banks.sequence.items.push(q); }
      for(const q of pack.writing){ data.banks.writing.items.push(q); }
      state.seen[hash] = { title: source.name, source: source.url, addedAt: new Date().toISOString() };
      changed = true;
    }
  }
  if(changed){
    const sealed = encryptContent(data);
    await fs.writeFile(INDEX_PATH, replaceSealed(html, sealed), 'utf8');
    await fs.writeFile(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
    console.log('Question bank updated.');
  }else{
    console.log('No new source text detected.');
  }
}
main().catch(err => { console.error(err); process.exit(1); });

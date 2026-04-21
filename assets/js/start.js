(function(){
  const targetView = (document.documentElement.getAttribute('data-view') || '').trim();
  const swPath = document.documentElement.getAttribute('data-sw') || './service-worker.js';
  const boot = document.getElementById('bootNotice');
  let ready = false;

  function bootHtml(title, desc){
    if(!boot) return;
    boot.innerHTML = '<div class="boot-card"><h2>' + title + '</h2><p>' + desc + '</p><div class="boot-actions"><button type="button" class="boot-btn" onclick="__bootClearCachesAndReload()">清缓存后重开</button><button type="button" class="boot-btn secondary" onclick="location.href=\'./index.html\'">回首页</button></div></div>';
    boot.classList.remove('hidden');
  }

  function hideBoot(){
    ready = true;
    if(boot) boot.classList.add('hidden');
  }

  function appHasContent(){
    const app = document.getElementById('app');
    const sidebar = document.getElementById('sidebar');
    return !!(app && app.innerHTML && app.innerHTML.trim().length > 40 && sidebar && sidebar.innerHTML && sidebar.innerHTML.trim().length > 40);
  }

  function showSoftLoading(){
    if(ready) return;
    const suffix = window.__storageFallback ? ' 当前环境禁用了本地存储，已自动切换为临时内存模式。' : '';
    bootHtml('正在启动页面', '系统已经载入壳页面，正在渲染内容。若持续空白，先点“清缓存后重开”。' + suffix);
  }

  function showHardError(message){
    const extra = window.__storageFallback ? '（已启用临时存储兼容模式）' : '';
    bootHtml('页面启动失败', (message || '脚本未正常完成渲染。') + ' ' + extra);
  }

  async function clearCachesAndReload(){
    try{
      if('serviceWorker' in navigator && navigator.serviceWorker.getRegistrations){
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(reg => reg.unregister()));
      }
      if(window.caches && caches.keys){
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    }catch(err){}
    location.reload();
  }
  window.__bootClearCachesAndReload = clearCachesAndReload;

  function applyTargetView(){
    if(!targetView) return;
    try{
      if(typeof state !== 'undefined' && state && typeof state === 'object'){
        state.activeView = targetView;
        if(typeof saveState === 'function') saveState();
      }
      if(typeof switchView === 'function') return void switchView(targetView);
      if(typeof setView === 'function') return void setView(targetView);
      if(typeof renderApp === 'function') return void renderApp();
    }catch(err){
      showHardError(err && err.message ? err.message : String(err));
    }
  }

  function markReadyIfPossible(){
    if(appHasContent()) hideBoot();
  }

  function registerSW(){
    try{
      if('serviceWorker' in navigator){
        navigator.serviceWorker.register(swPath).catch(function(){});
      }
    }catch(err){}
  }

  window.addEventListener('error', function(event){
    showHardError((event && event.message) ? event.message : '发生脚本错误');
  });
  window.addEventListener('unhandledrejection', function(event){
    const msg = event && event.reason ? (event.reason.message || String(event.reason)) : '发生异步错误';
    showHardError(msg);
  });

  function bootMain(){
    showSoftLoading();
    applyTargetView();
    markReadyIfPossible();
    setTimeout(function(){
      try{ applyTargetView(); }catch(err){}
      markReadyIfPossible();
      if(!ready){
        if(window.__bootErrors && window.__bootErrors.length){
          showHardError(window.__bootErrors[window.__bootErrors.length - 1].message || '页面渲染失败');
        }else if(appHasContent()){
          hideBoot();
        }else{
          showSoftLoading();
        }
      }
    }, 800);
    setTimeout(function(){
      if(!ready){
        if(window.__bootErrors && window.__bootErrors.length){
          showHardError(window.__bootErrors[window.__bootErrors.length - 1].message || '页面渲染失败');
        }else if(appHasContent()){
          hideBoot();
        }else{
          showHardError('页面长时间没有完成渲染，通常是旧缓存、脚本加载失败或浏览器直接打开本地文件导致。');
        }
      }
    }, 4000);
  }

  if(document.readyState !== 'loading') bootMain();
  else document.addEventListener('DOMContentLoaded', bootMain, { once:true });
  window.addEventListener('load', function(){ registerSW(); markReadyIfPossible(); setTimeout(markReadyIfPossible, 250); }, { once:true });
})();

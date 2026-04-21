(function(){
  function createMemoryStorage(){
    const store = new Map();
    return {
      get length(){ return store.size; },
      key(i){ return Array.from(store.keys())[i] || null; },
      getItem(k){ k = String(k); return store.has(k) ? store.get(k) : null; },
      setItem(k,v){ store.set(String(k), String(v)); },
      removeItem(k){ store.delete(String(k)); },
      clear(){ store.clear(); }
    };
  }
  function ensureStorage(name){
    let ok = false;
    try{
      const s = window[name];
      if(s){
        const key = '__boot_test__' + Math.random();
        s.setItem(key,'1');
        s.removeItem(key);
        ok = true;
      }
    }catch(err){ ok = false; }
    if(!ok){
      try{
        Object.defineProperty(window, name, { value:createMemoryStorage(), configurable:true });
      }catch(err){
        window[name] = createMemoryStorage();
      }
      window.__storageFallback = true;
    }
  }
  ensureStorage('localStorage');
  ensureStorage('sessionStorage');
  window.__bootPackageVersion = document.documentElement.getAttribute('data-build') || '';
  window.__bootErrors = [];
  window.addEventListener('error', function(event){
    try{
      window.__bootErrors.push({ type:'error', message:event.message || '脚本错误', file:event.filename || '', line:event.lineno || 0 });
    }catch(err){}
  });
  window.addEventListener('unhandledrejection', function(event){
    try{
      const reason = event && event.reason ? (event.reason.message || String(event.reason)) : 'Promise rejected';
      window.__bootErrors.push({ type:'promise', message:reason });
    }catch(err){}
  });
})();

// DESFE service worker. Bump V on every release so old caches are dropped.
const V='desfe-v2';
const A=['./','index.html','manifest.json','vendor/appwrite.js','fonts/plus-jakarta-sans-latin-500-normal.woff2','fonts/plus-jakarta-sans-latin-700-normal.woff2','fonts/plus-jakarta-sans-latin-800-normal.woff2','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/favicon-32.png','icons/apple-touch-icon.png'];
// Files that must always be fresh when online (config + app shell). Cache is only the offline fallback.
const FRESH=['env.js','index.html','sw.js','manifest.json'];

self.addEventListener('install',e=>{
  // Cache each file separately so one missing file does not break the whole install.
  e.waitUntil(caches.open(V).then(c=>Promise.all(A.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!='GET'||u.origin!=location.origin)return;      // Appwrite API calls are never touched
  const name=u.pathname.split('/').pop()||'index.html';
  const fresh=r.mode=='navigate'||FRESH.includes(name);
  const save=n=>{if(n&&n.ok){const c=n.clone();caches.open(V).then(x=>x.put(r,c))}return n};
  if(fresh){                                                  // network first, cache when offline
    e.respondWith(fetch(r).then(save).catch(()=>caches.match(r,{ignoreSearch:true}).then(c=>c||caches.match('index.html'))));
  }else{                                                      // cache first for fonts, icons, SDK
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>c||fetch(r).then(save).catch(()=>caches.match('index.html'))));
  }
});
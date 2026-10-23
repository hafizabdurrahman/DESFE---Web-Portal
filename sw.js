const V='desfe-v1',A=['./','index.html','env.js','manifest.json','vendor/appwrite.js','fonts/plus-jakarta-sans-latin-500-normal.woff2','fonts/plus-jakarta-sans-latin-700-normal.woff2','fonts/plus-jakarta-sans-latin-800-normal.woff2','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/favicon-32.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!='GET'||u.origin!=location.origin)return;
e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(e.request,c));return n}).catch(()=>caches.match('index.html'))))});

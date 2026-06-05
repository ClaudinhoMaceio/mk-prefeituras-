const CACHE='mk360-v1';
const ASSETS=[
  '/apresentacao.html',
  '/manifest.webmanifest',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/booth.jpg',
  '/img/evento.jpg',
  '/img/mk-promo.jpg',
  '/img/plataforma360.jpg',
  '/img/publico.jpg'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // Never cache the TTS endpoint
  if(url.pathname.startsWith('/api/')) return;
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      if(resp.ok && url.origin===location.origin){
        const clone=resp.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
      }
      return resp;
    }).catch(()=>caches.match('/apresentacao.html')))
  );
});

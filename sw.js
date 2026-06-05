const CACHE='mk360-v4';
const ASSETS=[
  '/apresentacao.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/img/icon-192.ico',
  '/img/icon-512.ico',
  '/img/booth.jpeg',
  '/img/evento.jpeg',
  '/img/mk-promo.jpg',
  '/img/plataforma360.jpg',
  '/img/publico.jpg',
  '/audio/slide-0.mp3','/audio/slide-1.mp3','/audio/slide-2.mp3','/audio/slide-3.mp3',
  '/audio/slide-4.mp3','/audio/slide-5.mp3','/audio/slide-6.mp3','/audio/slide-7.mp3',
  '/audio/slide-8.mp3','/audio/slide-9.mp3','/audio/slide-10.mp3','/audio/slide-11.mp3'
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

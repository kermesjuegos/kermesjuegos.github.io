// Kermés: guarda el juego en el celular para usarlo sin conexión
const C = "kermes-equipo-en-juego-202611022257", CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"], AUDIO = [];
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(CORE))); });
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== C && k.startsWith("kermes-" + C.split("-").slice(1, -1).join("-"))) await caches.delete(k);
    await self.clients.claim();
    const c = await caches.open(C);
    for (const a of AUDIO) { try { if (!(await c.match(a))) await c.add(a); } catch (_) {} }
  })());
});
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin === location.origin && (r.mode === "navigate" || u.pathname.endsWith("/index.html"))) {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put("index.html", cp)); return res; })
      .catch(() => caches.match("index.html", { ignoreSearch: true })));
    return;
  }
  if (u.origin === location.origin || u.host.endsWith("fonts.googleapis.com") || u.host.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => {
      if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); }
      return res; })));
  }
});

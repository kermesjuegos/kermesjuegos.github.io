// Kermés: guarda el juego en el celular para usarlo sin conexión
const C = "kermes-ronda-brava-202611061634", CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"], AUDIO = ["audio/c1.mp3", "audio/c10.mp3", "audio/c11.mp3", "audio/c12.mp3", "audio/c13.mp3", "audio/c14.mp3", "audio/c15.mp3", "audio/c16.mp3", "audio/c17.mp3", "audio/c18.mp3", "audio/c19.mp3", "audio/c2.mp3", "audio/c20.mp3", "audio/c21.mp3", "audio/c22.mp3", "audio/c23.mp3", "audio/c24.mp3", "audio/c25.mp3", "audio/c26.mp3", "audio/c27.mp3", "audio/c28.mp3", "audio/c29.mp3", "audio/c3.mp3", "audio/c30.mp3", "audio/c31.mp3", "audio/c32.mp3", "audio/c33.mp3", "audio/c34.mp3", "audio/c35.mp3", "audio/c36.mp3", "audio/c37.mp3", "audio/c38.mp3", "audio/c39.mp3", "audio/c4.mp3", "audio/c40.mp3", "audio/c41.mp3", "audio/c42.mp3", "audio/c43.mp3", "audio/c44.mp3", "audio/c45.mp3", "audio/c46.mp3", "audio/c47.mp3", "audio/c48.mp3", "audio/c49.mp3", "audio/c5.mp3", "audio/c50.mp3", "audio/c51.mp3", "audio/c52.mp3", "audio/c53.mp3", "audio/c54.mp3", "audio/c55.mp3", "audio/c56.mp3", "audio/c57.mp3", "audio/c58.mp3", "audio/c59.mp3", "audio/c6.mp3", "audio/c60.mp3", "audio/c7.mp3", "audio/c8.mp3", "audio/c9.mp3", "audio/intro.mp3"];
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

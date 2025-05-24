export const onRequest: PagesFunction = async (context) => {
  const kv = context.env.MY_KV; // Mengakses Cloudflare KV
  const cache = caches.default; // Menggunakan Cloudflare Cache API
  const url = new URL(context.request.url);
  const s = url.searchParams.get("s");

  if (context.request.method === "GET") {
    if (s) {
      // Cek apakah data sudah ada di cache
      const cacheKey = new Request(context.request.url);
      let cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Ambil data berdasarkan key dengan cache selama 60 detik
      const value = await kv.get(s, { cacheTtl: 60 });
      const response = new Response(value || "Data tidak ditemukan.", {
        status: value ? 200 : 404,
        headers: { "Cache-Control": "max-age=300" }, // Cache selama 5 menit
      });

      // Simpan ke cache untuk akses lebih cepat
      await cache.put(cacheKey, response.clone());

      return response;
    } else {
      // Cek apakah daftar key sudah ada di cache
      const cacheKey = new Request(context.request.url + "?list=true");
      let cachedListResponse = await cache.match(cacheKey);
      if (cachedListResponse) {
        return cachedListResponse;
      }

      // Jika belum ada di cache, ambil daftar key dari KV
      const keys = await kv.list();
      const listResponse = new Response(JSON.stringify(keys), {
        headers: { "Content-Type": "application/json", "Cache-Control": "max-age=300" },
        status: 200,
      });

      // Simpan daftar key ke cache untuk akses lebih cepat
      await cache.put(cacheKey, listResponse.clone());

      return listResponse;
    }
  }

  return new Response("Metode tidak didukung.", { status: 405 });
};

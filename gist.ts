export const onRequest: PagesFunction = async (context) => {
  const kv = context.env.MY_KV; // Mengakses Cloudflare KV

  // if (context.request.method === "POST") {
  //   // Simpan data ke KV
  //   const { key, value } = await context.request.json();
  //   await kv.put(key, value);
  //   return new Response(`Data tersimpan dengan key: ${key}`, { status: 200 });
  // }

  if (context.request.method === "GET") {
    const url = new URL(context.request.url);
    const s = url.searchParams.get("s");

    if (s) {
      // Ambil data berdasarkan key
      const value = await kv.get(s);
      return new Response(value || "Data tidak ditemukan.", { status: 404 });
    } else {
      // Jika tidak ada parameter key, tampilkan daftar semua key
      const keys = await kv.list();
      return new Response(JSON.stringify(keys), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  }

  return new Response("Metode tidak didukung.", { status: 405 });
};

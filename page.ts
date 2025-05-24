export const onRequest: PagesFunction = async (context) => {
    const kvNamespace = await context.env.MY_KV; // Gantilah dengan namespace KV yang sesuai
    const htmlCode = await kvNamespace.get("sample-html"); // Gantilah dengan kunci HTML yang digunakan

    if (!htmlCode) {
        return new Response("HTML tidak ditemukan", { status: 404 });
    }

    return new Response(htmlCode, {
        headers: { "Content-Type": "text/html" },
    });
};

export const onRequest: PagesFunction = async ({ request, env }) => {
    const kv = env.MY_KV;
    const url = new URL(request.url);
    const title = url.searchParams.get("s") || "Data tidak ditemukan";

    // Coba ambil dari Cache API terlebih dahulu
    const cache = caches.default;
    let response = await cache.match(request);

    if (!response) {
        // Jika tidak ditemukan di cache, ambil dari KV
        const kvData = await kv.get(title) || "Data tidak ditemukan";

        // Fungsi untuk menghindari eksekusi kode HTML
        const escapeHTML = (unsafeString: string) => {
            return unsafeString
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        const safeKvData = escapeHTML(kvData);

        const htmlResponse = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 1012px;
                    margin: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    position: relative; /* Tambahan untuk membuat posisi relatif */
                }
                .code {
                    background: #2d2d2d;
                    color: #ffffff;
                    font-family: monospace;
                    padding: 10px;
                    border-radius: 5px;
                    white-space: pre-wrap;
                    overflow-x: auto;
                }
                .copy-btn {
                    position: absolute; /* Tambahan */
                    top: 41px; /* Geser ke atas */
                    right: 20px; /* Geser ke kanan */
                    padding: 5px 10px;
                    border: none;
                    background: #007bff;
                    color: white;
                    cursor: pointer;
                    border-radius: 3px;
                }
            </style>
        </head>
        <body>
        
            <div class="container">
                <h2>${title}</h2>
                <button class="copy-btn" onclick="copyCode()" id="copy-button">Salin</button>
                <pre class="code" id="code-snippet">${safeKvData}</pre>
            </div>
        
            <script>
                function copyCode() {
                    const code = document.getElementById("code-snippet").innerText;
                    navigator.clipboard.writeText(code).then(() => {
                        document.getElementById("copy-button").innerText = "Disalin";
                    });
                }
            </script>
        
        </body>
        </html>
        `;

        response = new Response(htmlResponse, {
            headers: {
                "Content-Type": "text/html",
                "Cache-Control": "public, max-age=300"
            }
        });

        // Simpan ke Cache API tanpa `ctx.waitUntil()`
        await cache.put(request, response.clone());
    }

    return response;
};

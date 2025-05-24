export const onRequest: PagesFunction = async (context) => {
    const { request } = context;
    const url = new URL(request.url);
    const queryIp = url.searchParams.get("ip") || request.headers.get("CF-Connecting-IP");

    if (!queryIp) {
        return new Response("IP tidak tersedia.", { status: 400 });
    }

    // Menggunakan API eksternal untuk mendapatkan informasi IP
    const apiUrl = `https://ipinfo.io/${queryIp}/json`;
    const ipResponse = await fetch(apiUrl);
    
    if (!ipResponse.ok) {
        return new Response("Gagal mengambil data IP.", { status: 500 });
    }

    const ipInfo = await ipResponse.json();

    return new Response(JSON.stringify(ipInfo, null, 2), {
        headers: { "Content-Type": "application/json" }
    });
};

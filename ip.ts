export const onRequest: PagesFunction = async (context) => {
    const { request } = context;
    const cf = request.cf;

    if (!cf) {
        return new Response("Cloudflare metadata tidak tersedia.", { status: 500 });
    }

    const ipInfo = {
        ip: request.headers.get("CF-Connecting-IP") || "Tidak tersedia",
        country: cf.country || "Tidak tersedia",
        city: cf.city || "Tidak tersedia",
        region: cf.region || "Tidak tersedia",
        latitude: cf.latitude || "Tidak tersedia",
        longitude: cf.longitude || "Tidak tersedia",
        postalCode: cf.postalCode || "Tidak tersedia",
        timezone: cf.timezone || "Tidak tersedia",
        asn: cf.asn || "Tidak tersedia",
        org: cf.asOrganization || "Tidak tersedia"
    };

    return new Response(JSON.stringify(ipInfo, null, 2), {
        headers: { "Content-Type": "application/json" }
    });
};

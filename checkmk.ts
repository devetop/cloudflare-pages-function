export const onRequest: PagesFunction = async (context) => {
  const urlsToMonitor = [
    "https://example.com",
    "http://example.net"
  ];
  const results = [];

  for (const url of urlsToMonitor) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Timeout 5 detik

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      const status = response.status === 200 ? "UP" : "DOWN";
      results.push({ url, status });
    } catch (error) {
      results.push({ url, status: "DOWN" }); // Jika terjadi error atau timeout, dianggap DOWN
    }
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};

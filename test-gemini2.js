const API_KEY = 'AIzaSyBjsqe4mEmWL-y0soH_6AwUf7HrCnrmaGE';
const endpoints = [
  { url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, name: 'v1 1.5-flash' },
  { url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, name: 'v1beta gemini-pro' }
];
(async () => {
  for (const ep of endpoints) {
    const res = await fetch(ep.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Say hi' }] }] })
    });
    console.log("Endpoint:", ep.name, "Status:", res.status);
    if (!res.ok) console.log(await res.text());
  }
})();

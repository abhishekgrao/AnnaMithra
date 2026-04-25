const API_KEY = 'AIzaSyBjsqe4mEmWL-y0soH_6AwUf7HrCnrmaGE';
const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
(async () => {
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Say hi' }] }] })
    });
    console.log("Model:", model, "Status:", res.status);
    if (!res.ok) console.log(await res.text());
  }
})();

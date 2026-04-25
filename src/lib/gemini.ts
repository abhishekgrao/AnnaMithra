export const getGeminiResponse = async (
  _history: any[],
  message: string,
  listingsContext?: string
): Promise<string> => {
  // Get API key from environment variables (Render/Vercel)
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    return "Error: Missing VITE_GEMINI_API_KEY. Please add your new Gemini API key to the environment variables (.env file or Render dashboard) to activate the AI.";
  }

  // Try multiple models — if one is rate-limited (429), try the next
  const models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
  ];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      });

      if (res.status === 429) {
        console.warn(`${model} rate-limited, trying next...`);
        continue;
      }

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errorData = await res.text();
        console.error(`${model} failed with status: ${res.status}`, errorData);
      }
    } catch (err) {
      console.warn(`${model} network error, trying next...`, err);
    }
  }

  return `API Connection Error: All Gemini models failed to respond. Please check your API key quota.`;
};

export const getGeminiResponse = async (history: { role: string; parts: { text: string }[] }[], message: string) => {
  const API_KEY = "AIzaSyBjsqe4mEmWL-y0soH_6AwUf7HrCnrmaGE";
  // Updated model name to gemini-2.5-flash as explicitly requested by the user
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  let filteredHistory = history.filter(m => m.role === 'user' || m.role === 'model');
  if (filteredHistory.length > 0 && filteredHistory[0].role === 'model') {
    filteredHistory = filteredHistory.slice(1);
  }

  const systemPrompt = "You are Symbiot, the AI assistant for AnnaMithra. Help NGOs and Shops with food surplus. Be concise.";
  
  const contents = filteredHistory.length === 0 
    ? [{ role: "user", parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }]
    : [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am Symbiot. How can I help?" }] },
        ...filteredHistory,
        { role: "user", parts: [{ text: message }] }
      ];

  const body = { contents };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API Error Detail:', data);
      throw new Error(data.error?.message || `HTTP ${response.status}: ${JSON.stringify(data)}`);
    }

    if (!data.candidates || !data.candidates[0]) {
      throw new Error('No AI response received. Please check API key status.');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('Fetch Error:', error);
    throw error;
  }
};

export const getGeminiResponse = async (
  history: any[],
  message: string,
  listingsContext?: string
): Promise<string> => {
  const API_KEY = "AIzaSyBjsqe4mEmWL-y0soH_6AwUf7HrCnrmaGE";

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

      // If rate-limited, try next model immediately
      if (res.status === 429) {
        console.warn(`${model} rate-limited, trying next...`);
        continue;
      }

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (_) {
      console.warn(`${model} network error, trying next...`);
    }
  }

  // ── LOCAL INTELLIGENCE ENGINE (runs only if ALL models fail) ────
  // Extract ONLY the user's actual question, not the full context blob
  const userQ = message.includes("User Question:")
    ? message.split("User Question:").pop()!.trim().toLowerCase()
    : message.toLowerCase();

  // Search real listings context for specific items
  if (listingsContext) {
    const titles: string[] = [];
    const re = /\"(?:name|title)\":\s*\"([^\"]+)\"/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(listingsContext)) !== null) titles.push(m[1]);

    if (titles.length > 0) {
      const match = titles.find((t) => userQ.includes(t.toLowerCase()));
      if (match) {
        return `Yes! "${match}" is currently available in the network. Head to the Explore tab to see its location and claim it.`;
      }
      if (userQ.includes("any") || userQ.includes("available") || userQ.includes("is there") || userQ.includes("find") || userQ.includes("listing")) {
        return `Here's what's live right now: ${titles.slice(0, 3).join(", ")}. Check the Explore map for full details and to claim items near you!`;
      }
    }
  }

  if (userQ.includes("tax") || userQ.includes("80g") || userQ.includes("benefit") || userQ.includes("receipt")) {
    return "All verified donations on AnnaMithra qualify for Section 80G tax deductions. Your cumulative receipt is auto-generated — download it anytime from the 'Donation History & Tax Benefits' section on your profile page.";
  }
  if (userQ.includes("safety") || userQ.includes("audit") || userQ.includes("quality") || userQ.includes("fresh")) {
    return "Every listing goes through our AI-powered visual safety audit. We verify freshness, packaging, and expiry before the item appears on the map. Look for the green 'AI Verified' badge!";
  }
  if (userQ.includes("volunteer") || userQ.includes("mithra") || userQ.includes("pickup") || userQ.includes("delivery")) {
    return "Mithra volunteers handle last-mile delivery. Once an NGO claims a listing, the nearest Mithra is auto-notified and will arrive for pickup within 30 minutes.";
  }
  if (userQ.includes("upload") || userQ.includes("add") || userQ.includes("donate") || userQ.includes("surplus")) {
    return "To donate surplus food, go to the Upload tab. Fill in the food name, quantity, and snap a photo for our AI safety check. Nearby NGOs get notified instantly!";
  }
  if (userQ.includes("claim") || userQ.includes("ngo") || userQ.includes("serve")) {
    return "As a Serve (NGO) partner, open the Explore map to see all available donations nearby. Tap 'Claim' on any listing and a Mithra volunteer will be dispatched.";
  }
  if (userQ.includes("hello") || userQ.includes("hi") || userQ.includes("hey") || userQ.includes("hai")) {
    return "Hey there! 👋 I'm Symbiot, your AnnaMithra AI. I can help you find nearby food, upload donations, request a Mithra volunteer, or check your tax benefits. What do you need?";
  }

  return "I'm Symbiot, the AnnaMithra AI. I can help with: finding available food, uploading donations, requesting Mithra volunteers, tax receipts (80G), or safety audits. What would you like to know?";
};

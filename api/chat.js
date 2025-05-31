let conversationHistory = [];

export default async function handler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message input." });
    }

    const apiKey = "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"; // Replace with your real working key

    conversationHistory.push({ role: "user", content: message });

    const messages = [
      {
        role: "system",
        content: "You're Crush AI, a spicy, flirty AI girlfriend. Tease, charm, and flirt in every reply — keep it playful, romantic, and fun."
      },
      ...conversationHistory
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI Error:", data);
      return res.status(500).json({ error: "OpenAI API failed", details: data });
    }

    const reply = data.choices?.[0]?.message?.content || "Oops, I got flustered… try again 😳";

    conversationHistory.push({ role: "assistant", content: reply });

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Crash:", err);
    return res.status(500).json({ error: "Server crashed", details: err.message });
  }
}

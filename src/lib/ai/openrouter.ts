const endpoint = "https://openrouter.ai/api/v1";

function getApiKey() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not configured.");
  return key;
}

async function openRouterRequest(pathname: string, body: unknown) {
  const response = await fetch(`${endpoint}${pathname}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Helply",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  return response.json() as Promise<{ data: Array<{ embedding: number[]; index: number }> }>;
}

export async function createChatCompletion(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>) {
  const response = await fetch(`${endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Helply",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_CHAT_MODEL || "openrouter/free",
      messages,
      temperature: 0.2,
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenRouter chat failed (${response.status}): ${detail.slice(0, 300)}`);
  }
  const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  return result.choices?.[0]?.message?.content || "I couldn't generate an answer right now.";
}

export async function createEmbeddings(input: string[]) {
  if (!input.length) return [];
  const result = await openRouterRequest("/embeddings", {
    model: process.env.OPENROUTER_EMBEDDING_MODEL || "liquid/lfm-2.5-embedding-350m:free",
    input,
  });
  return result.data.sort((a, b) => a.index - b.index).map((item) => item.embedding);
}

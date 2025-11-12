import OpenAI from "openai";

// AI Provider types
export type AIProvider = "gemini" | "openai";

// Get AI provider from environment
export const getAIProvider = (): AIProvider => {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  return provider === "openai" ? "openai" : "gemini";
};

// OpenAI client
let openaiClient: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is required when using OpenAI provider");
    }
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openaiClient;
};

// Gemini API call function
export async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_API_KEY is required");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Gemini API error: ${errorData.error?.message || "Unknown error"}`
    );
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// OpenAI API call function
export async function callOpenAIAPI(
  prompt: string,
  model: string = "gpt-3.5-turbo"
): Promise<string> {
  const client = getOpenAIClient();

  try {
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    throw new Error(
      `OpenAI API error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Unified AI call function
export async function callAI(
  prompt: string,
  options?: {
    provider?: AIProvider;
    model?: string;
  }
): Promise<string> {
  const provider = options?.provider || getAIProvider();

  console.log(`Using AI provider: ${provider}`);

  if (provider === "openai") {
    const model = options?.model || "gpt-3.5-turbo";
    return await callOpenAIAPI(prompt, model);
  } else {
    return await callGeminiAPI(prompt);
  }
}

// Test AI connection
export async function testAIConnection(
  provider?: AIProvider
): Promise<{ success: boolean; message: string; provider: AIProvider }> {
  const testProvider = provider || getAIProvider();
  const testPrompt =
    'Say "Hello, AI connection test successful!" in exactly those words.';

  try {
    const response = await callAI(testPrompt, { provider: testProvider });
    const success = response
      .toLowerCase()
      .includes("ai connection test successful");

    return {
      success,
      message: success
        ? `✅ ${testProvider.toUpperCase()} API connected successfully`
        : `❌ ${testProvider.toUpperCase()} API response unexpected: ${response}`,
      provider: testProvider,
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ ${testProvider.toUpperCase()} API connection failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      provider: testProvider,
    };
  }
}

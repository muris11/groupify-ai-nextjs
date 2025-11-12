import OpenAI from "openai";

// Simple in-memory cache for AI responses
const responseCache = new Map<
  string,
  { response: string; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// AI Provider types
export type AIProvider = "openai" | "groq";

// Get AI provider from environment
export const getAIProvider = (): AIProvider => {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === "openai") return "openai";
  if (provider === "groq") return "groq";
  return "groq"; // default
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

// Groq API call function
export async function callGroqAPI(
  prompt: string,
  model: string = "llama-3.1-8b-instant"
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is required");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Groq API error: ${errorData.error?.message || "Unknown error"}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// Unified AI call function with fallback
export async function callAI(
  prompt: string,
  options?: {
    provider?: AIProvider;
    model?: string;
  }
): Promise<string> {
  // Check cache first
  const cacheKey = `${options?.provider || getAIProvider()}:${prompt}`;
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached response");
    return cached.response;
  }

  const primaryProvider = options?.provider || getAIProvider();

  console.log(`Using AI provider: ${primaryProvider}`);

  // Try primary provider first
  try {
    let result: string;
    if (primaryProvider === "openai") {
      const model = options?.model || "gpt-3.5-turbo";
      result = await callOpenAIAPI(prompt, model);
    } else {
      // Default to groq
      const model = options?.model || "llama-3.1-8b-instant";
      result = await callGroqAPI(prompt, model);
    }

    // Cache the result
    responseCache.set(cacheKey, { response: result, timestamp: Date.now() });
    return result;
  } catch (primaryError) {
    console.warn(`Primary provider ${primaryProvider} failed:`, primaryError);

    // Try fallback provider if available
    const getFallbackProvider = (primary: AIProvider): AIProvider => {
      if (primary === "groq") return "openai";
      return "groq"; // if primary is openai, fallback to groq
    };

    const fallbackProvider = getFallbackProvider(primaryProvider);

    // Check if fallback provider has API key
    const hasFallbackKey =
      (fallbackProvider === "openai" && !!process.env.OPENAI_API_KEY) ||
      (fallbackProvider === "groq" && !!process.env.GROQ_API_KEY);

    if (hasFallbackKey) {
      console.log(`Trying fallback provider: ${fallbackProvider}`);
      try {
        let result: string;
        if (fallbackProvider === "openai") {
          const model = options?.model || "gpt-3.5-turbo";
          result = await callOpenAIAPI(prompt, model);
        } else {
          // Default to groq
          const model = options?.model || "llama-3.1-8b-instant";
          result = await callGroqAPI(prompt, model);
        }

        // Cache the result
        responseCache.set(cacheKey, {
          response: result,
          timestamp: Date.now(),
        });
        return result;
      } catch (fallbackError) {
        console.error(
          `Fallback provider ${fallbackProvider} also failed:`,
          fallbackError
        );
        throw new Error(
          `Both AI providers failed. Primary: ${
            primaryError instanceof Error
              ? primaryError.message
              : "Unknown error"
          }. Fallback: ${
            fallbackError instanceof Error
              ? fallbackError.message
              : "Unknown error"
          }`
        );
      }
    } else {
      console.warn(
        `No fallback provider available (missing ${fallbackProvider.toUpperCase()}_API_KEY)`
      );
      throw primaryError; // Re-throw original error
    }
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

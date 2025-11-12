import { callAI, getAIProvider } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { groups, context } = await request.json();

    if (!groups || !Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json(
        { error: "Kelompok tidak valid" },
        { status: 400 }
      );
    }

    let prompt = `Saya perlu membuat ${groups.length} pertanyaan pemecah es (icebreaker) untuk ${groups.length} kelompok. `;

    if (context) {
      prompt += `Konteksnya adalah: ${context}. `;
    }

    prompt += `Buatkan ${groups.length} pertanyaan pemecah es yang unik dan cocok untuk team building. 
    Buat pertanyaan yang menarik dan menyenangkan, cocok untuk saling mengenal.
    Gunakan Bahasa Indonesia yang natural dan sesuai budaya Indonesia.
    
    Kembalikan response dalam format JSON seperti ini (HANYA JSON, tanpa markdown atau text tambahan):
    {
      "icebreakers": [
        {
          "groupIndex": 0,
          "question": "Ceritakan satu hal menarik tentang dirimu yang jarang orang tahu?"
        },
        {
          "groupIndex": 1,
          "question": "Jika kamu bisa punya satu superkekuatan, apa itu dan mengapa?"
        }
      ]
    }`;

    console.log(
      `Generating icebreakers with ${getAIProvider().toUpperCase()}...`
    );

    // Use unified AI function
    const messageContent = await callAI(prompt);

    if (!messageContent) {
      return NextResponse.json(
        { error: "AI tidak dapat menghasilkan respons. Silakan coba lagi." },
        { status: 500 }
      );
    }

    try {
      // Clean up the response to extract JSON
      let jsonText = messageContent.trim();
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      jsonText = jsonText.replace(/```\n?$/g, "").trim();

      console.log("Attempting to parse JSON:", jsonText.substring(0, 200));
      const parsedResult = JSON.parse(jsonText);
      console.log("Successfully parsed icebreakers");
      return NextResponse.json(parsedResult);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback icebreakers if parsing fails
      const fallbackIcebreakers = [
        "Ceritakan satu hal menarik tentang dirimu yang jarang orang tahu?",
        "Jika kamu bisa punya satu superkekuatan, apa itu dan mengapa?",
        "Apa hal terbaik yang terjadi padamu minggu ini?",
        "Jika bisa traveling ke mana saja, kamu akan ke mana?",
        "Skill apa yang ingin kamu pelajari dan mengapa?",
        "Apa cara favoritmu untuk rileks setelah hari yang panjang?",
        "Jika bisa bertemu tokoh sejarah mana pun, siapa yang kamu pilih?",
        "Tempat paling menarik yang pernah kamu kunjungi?",
      ];

      const icebreakers = groups.map((_: any, index: number) => ({
        groupIndex: index,
        question: fallbackIcebreakers[index % fallbackIcebreakers.length],
      }));

      console.log("Using fallback icebreakers");
      return NextResponse.json({ icebreakers });
    }
  } catch (error) {
    console.error("Error generating icebreakers:", error);

    // Provide more specific error messages
    let errorMessage = "Terjadi kesalahan server";
    let statusCode = 500;

    if (error instanceof Error) {
      if (
        error.message.includes("rate limit") ||
        error.message.includes("429")
      ) {
        errorMessage =
          "Batas penggunaan AI tercapai. Silakan tunggu beberapa saat sebelum mencoba lagi.";
        statusCode = 429;
      } else if (
        error.message.includes("API key") ||
        error.message.includes("authentication")
      ) {
        errorMessage =
          "Konfigurasi AI tidak valid. Periksa pengaturan API key.";
        statusCode = 500;
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Masalah koneksi jaringan. Periksa koneksi internet Anda.";
        statusCode = 503;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

import { callAI, getAIProvider } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { names, groups, attributes, balanceCriteria } = await request.json();

    if (!names || !Array.isArray(names) || names.length === 0) {
      return NextResponse.json({ error: "Nama tidak valid" }, { status: 400 });
    }

    if (!groups || !Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json(
        { error: "Kelompok tidak valid" },
        { status: 400 }
      );
    }

    let prompt = `Saya perlu menyeimbangkan kelompok secara adil berdasarkan kriteria berikut:\n\n`;
    prompt += `Peserta: ${names.join(", ")}\n\n`;
    prompt += `Kelompok saat ini:\n`;

    groups.forEach((group: any[], index: number) => {
      prompt += `Kelompok ${index + 1}: ${group.join(", ")}\n`;
    });

    if (attributes && Object.keys(attributes).length > 0) {
      prompt += `\nAtribut peserta:\n`;
      Object.entries(attributes).forEach(([name, attrs]: [string, any]) => {
        prompt += `${name}: ${JSON.stringify(attrs)}\n`;
      });
    }

    if (balanceCriteria) {
      prompt += `\nKriteria keseimbangan: ${balanceCriteria}\n`;
    }

    prompt += `\nBerikan saran distribusi yang lebih baik untuk peserta ini di kelompok yang ada untuk memastikan keseimbangan yang adil. 
    Kembalikan respons sebagai objek JSON dengan struktur ini:
    {
      "suggestion": "Penjelasan singkat tentang pendekatan penyeimbangan",
      "groups": [["nama1", "nama2"], ["nama3", "nama4"], ...]
    }
    Kembalikan HANYA JSON yang valid, tanpa markdown atau teks tambahan.`;

    console.log(`Balancing groups with ${getAIProvider().toUpperCase()}...`);

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

      const parsedResult = JSON.parse(jsonText);
      return NextResponse.json(parsedResult);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        { error: "Gagal memproses respons AI. Format respons tidak valid." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error balancing groups:", error);

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

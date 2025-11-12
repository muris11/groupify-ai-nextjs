import { callAI, getAIProvider } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { count, theme, context } = await request.json();

    if (!count || count < 1) {
      return NextResponse.json(
        { error: "Jumlah kelompok tidak valid" },
        { status: 400 }
      );
    }

    const themeDescriptions: Record<string, string> = {
      umum: "umum dan netral yang cocok untuk berbagai situasi",
      superhero: "superhero, pahlawan, dan karakter heroik",
      mitologi: "mitologi, legenda, dan cerita epik dari berbagai budaya",
      teknologi: "teknologi, digital, dan inovasi modern",
      alam: "alam, lingkungan, dan keindahan bumi",
      olahraga: "olahraga, tim profesional, dan semangat kompetisi",
      sains: "sains, penelitian, dan penemuan ilmiah",
      seni: "seni, kreativitas, dan ekspresi",
      makanan: "makanan, kuliner, dan cita rasa",
      indonesia: "budaya Indonesia, kearifan lokal, dan kebanggaan nasional",
    };

    const themeDesc = themeDescriptions[theme] || themeDescriptions.umum;

    let prompt = `Buatkan TEPAT ${count} nama tim yang kreatif, unik, dan menarik dalam Bahasa Indonesia.

Tema: ${themeDesc}

Persyaratan:
- Nama harus kreatif, mudah diingat, dan memotivasi
- Gunakan bahasa yang cocok untuk lingkungan pendidikan/profesional
- Setiap nama maksimal 3-4 kata
- Jangan gunakan angka atau nomor di nama tim
- Hindari nama yang terlalu umum atau generik
${context ? `- Konteks tambahan: ${context}` : ""}

Kembalikan HANYA array JSON berisi ${count} nama tim, seperti:
["Tim Garuda Emas", "Tim Nusantara Jaya", "Tim Merah Putih"]

PENTING: Kembalikan HANYA JSON array, tanpa markdown, penjelasan, atau teks tambahan apapun.`;

    console.log(
      `Generating team names with ${getAIProvider().toUpperCase()}...`
    );

    // Use unified AI function
    const messageContent = await callAI(prompt);

    if (!messageContent) {
      return NextResponse.json(
        { error: "Gagal membuat nama tim" },
        { status: 500 }
      );
    }

    try {
      // Clean up the response to extract JSON
      let jsonText = messageContent.trim();
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      jsonText = jsonText.replace(/```\n?$/g, "").trim();

      console.log("Parsing JSON:", jsonText.substring(0, 200));
      const teamNames = JSON.parse(jsonText);
      console.log("Successfully parsed team names");
      return NextResponse.json({ teamNames });
    } catch (parseError) {
      console.error("Failed to parse team names:", parseError);
      // Fallback to default names if parsing fails
      const fallbackNames = [
        "Tim Merah",
        "Tim Biru",
        "Tim Hijau",
        "Tim Kuning",
        "Tim Ungu",
        "Tim Oranye",
        "Tim Pink",
        "Tim Putih",
      ];
      console.log("Using fallback team names");
      return NextResponse.json({
        teamNames: fallbackNames.slice(0, count),
      });
    }
  } catch (error) {
    console.error("Error generating team names:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

/**
 * Script untuk mengganti teks Inggris ke Bahasa Indonesia
 * Run dengan: npx ts-node scripts/translate.ts
 */

const replacements = [
  // Button text
  ["Create Groups", "Buat Kelompok"],
  ["Generate", "Buat"],
  ["Generating...", "Membuat..."],
  ["Reset All", "Reset Semua"],
  ["Save List", "Simpan Daftar"],
  ["Load List", "Muat Daftar"],
  ["Delete", "Hapus"],
  ["Download", "Unduh"],
  ["Upload", "Unggah"],
  ["Share", "Bagikan"],
  ["Copy", "Salin"],
  ["Edit", "Edit"],
  ["Save", "Simpan"],
  ["Cancel", "Batal"],

  // Titles and headers
  ["Add Participants", "Tambah Peserta"],
  ["Group Settings", "Pengaturan Kelompok"],
  ["Constraints", "Batasan"],
  ["AI Features", "Fitur AI"],
  ["Interactive Editor", "Editor Interaktif"],
  ["Saved Lists", "Daftar Tersimpan"],
  ["Export Options", "Opsi Ekspor"],

  // Labels
  ["Names (one per line)", "Nama (satu per baris)"],
  ["Split by Number of Groups", "Bagi Berdasarkan Jumlah Kelompok"],
  ["Split by People per Group", "Bagi Berdasarkan Orang per Kelompok"],
  ["Number of Groups", "Jumlah Kelompok"],
  ["People per Group", "Orang per Kelompok"],
  ["Assign Team Leaders", "Tetapkan Ketua Tim"],
  ["Group Theme", "Tema Kelompok"],
  ["Generate AI Team Names", "Buat Nama Tim dengan AI"],
  ["Generate Icebreakers", "Buat Pemecah Es"],
  ["Smart Balance Groups", "Penyeimbangan Kelompok Pintar"],
  ["Enable Interactive Mode", "Aktifkan Mode Interaktif"],

  // Theme options
  ["Default", "Bawaan"],
  ["Colors", "Warna"],
  ["Animals", "Hewan"],
  ["Elements", "Elemen"],
  ["Space", "Luar Angkasa"],

  // Messages
  ["No names provided", "Tidak ada nama"],
  [
    "Please enter at least one name to create groups.",
    "Silakan masukkan setidaknya satu nama untuk membuat kelompok.",
  ],
  ["Groups created successfully!", "Kelompok berhasil dibuat!"],
  ["Copied to clipboard!", "Disalin ke clipboard!"],
  ["List saved successfully!", "Daftar berhasil disimpan!"],
  ["List deleted successfully!", "Daftar berhasil dihapus!"],
  ["Failed to generate", "Gagal membuat"],
  ["valid names entered", "nama valid dimasukkan"],

  // Constraints
  ["Must be together", "Harus Bersama"],
  ["Must be separate", "Harus Terpisah"],
  ["Add Constraint", "Tambah Batasan"],
  ["Remove Constraint", "Hapus Batasan"],

  // Export
  ["Export as JSON", "Ekspor sebagai JSON"],
  ["Export as CSV", "Ekspor sebagai CSV"],
  ["Export as Text", "Ekspor sebagai Teks"],
  ["Download Results", "Unduh Hasil"],

  // Stats
  ["Total Participants", "Total Peserta"],
  ["Total Groups", "Total Kelompok"],
  ["Average Group Size", "Rata-rata Ukuran Kelompok"],

  // Placeholders
  [
    "Add context for better AI results",
    "Tambahkan konteks untuk hasil AI yang lebih baik",
  ],
  ["Enter list name", "Masukkan nama daftar"],
];

console.log("Daftar terjemahan untuk digunakan:");
console.log("Total:", replacements.length, "terjemahan");
replacements.forEach(([en, id]) => {
  console.log(`"${en}" → "${id}"`);
});

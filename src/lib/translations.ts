// Konfigurasi terjemahan Bahasa Indonesia
export const translations = {
  // Navigation & Tabs
  create: "Buat",
  manage: "Kelola",
  history: "Riwayat",
  settings: "Pengaturan",

  // Actions
  generate: "Buat",
  shuffle: "Acak",
  reset: "Reset",
  resetAll: "Reset Semua",
  save: "Simpan",
  delete: "Hapus",
  download: "Unduh",
  upload: "Unggah",
  share: "Bagikan",
  copy: "Salin",
  edit: "Edit",
  cancel: "Batal",
  submit: "Kirim",
  apply: "Terapkan",
  close: "Tutup",

  // Groups
  group: "Kelompok",
  groups: "Kelompok",
  team: "Tim",
  teams: "Tim",
  createGroups: "Buat Kelompok",
  groupSettings: "Pengaturan Kelompok",
  groupTheme: "Tema Kelompok",

  // Participants
  participants: "Peserta",
  addParticipant: "Tambah Peserta",
  enterNames: "Masukkan Nama",
  namesPlaceholder: "Masukkan nama (satu per baris)",

  // Split modes
  splitByGroups: "Bagi Berdasarkan Jumlah Kelompok",
  splitByPeople: "Bagi Berdasarkan Orang per Kelompok",
  numberOfGroups: "Jumlah Kelompok",
  peoplePerGroup: "Orang per Kelompok",

  // Features
  constraints: "Batasan",
  addConstraint: "Tambah Batasan",
  mustBeTogether: "Harus Bersama",
  mustBeSeparate: "Harus Terpisah",
  assignLeaders: "Tetapkan Ketua",
  teamLeaders: "Ketua Tim",
  showRoles: "Tampilkan Peran",

  // AI Features
  aiFeatures: "Fitur AI",
  generateTeamNames: "Buat Nama Tim",
  generateIcebreakers: "Buat Pemecah Es",
  smartBalance: "Penyeimbangan Pintar",
  aiContext: "Konteks AI",
  contextPlaceholder: "Contoh: Untuk kelas pemrograman tingkat lanjut...",
  generating: "Membuat...",

  // Themes
  default: "Bawaan",
  colors: "Warna",
  animals: "Hewan",
  elements: "Elemen",
  space: "Luar Angkasa",

  // Messages
  noGroups: "Belum ada kelompok yang dibuat",
  enterNamesFirst: "Masukkan nama terlebih dahulu",
  groupsCreated: "Kelompok berhasil dibuat",
  copied: "Disalin ke clipboard",
  saved: "Tersimpan",
  deleted: "Terhapus",
  error: "Terjadi kesalahan",

  // Interactive
  interactiveMode: "Mode Interaktif",
  dragAndDrop: "Seret dan Lepas",
  enableInteractive: "Aktifkan Mode Interaktif",

  // Saved Lists
  savedLists: "Daftar Tersimpan",
  saveCurrentList: "Simpan Daftar Saat Ini",
  loadList: "Muat Daftar",
  deleteList: "Hapus Daftar",
  listName: "Nama Daftar",

  // Export/Import
  exportGroups: "Ekspor Kelompok",
  importNames: "Impor Nama",
  downloadAsJSON: "Unduh sebagai JSON",
  downloadAsCSV: "Unduh sebagai CSV",
  downloadAsText: "Unduh sebagai Teks",

  // Icebreakers
  icebreakers: "Pemecah Es",
  question: "Pertanyaan",
  noIcebreakers: "Belum ada pemecah es yang dibuat",

  // Stats
  totalParticipants: "Total Peserta",
  totalGroups: "Total Kelompok",
  averageSize: "Rata-rata Ukuran",

  // Theme toggle
  lightMode: "Mode Terang",
  darkMode: "Mode Gelap",
  systemTheme: "Tema Sistem",
};

export type TranslationKey = keyof typeof translations;

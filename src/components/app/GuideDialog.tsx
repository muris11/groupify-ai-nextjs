"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

interface GuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuideDialog({ open, onOpenChange }: GuideDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-2xl">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="text-sm sm:text-base">
              User Guide - Groupify AI
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm leading-relaxed">
          <div className="space-y-4">
            <div className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                🎯 Tentang Aplikasi
              </h3>
              <p className="text-muted-foreground">
                <strong>Groupify AI</strong> is a web application that helps you
                create random groups automatically with AI assistance. Perfect
                for teachers, trainers, event organizers, or anyone who needs to
                divide participants into fair and efficient groups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  ✨ Fitur Utama
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>
                      Pembagian kelompok otomatis berdasarkan jumlah kelompok
                      atau orang per kelompok
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Nama tim kreatif dengan AI Google Gemini</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Penyeimbangan pintar dengan algoritma AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Pertanyaan pemecah es untuk setiap kelompok</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Batasan khusus untuk aturan tertentu</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  🚀 Cara Menggunakan (3 Langkah Mudah)
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <span className="shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <strong>Masukkan Peserta</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ketik nama peserta, satu per baris. Minimal 2 peserta.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <span className="shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <strong>Atur Pengaturan</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pilih jumlah kelompok dan tema AI untuk nama tim.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <span className="shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <strong>Buat Kelompok</strong>
                      <p className="text-xs text-muted-foreground mt-1">
                        Klik "Acak Kelompok" dan lihat hasilnya!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base flex items-center gap-2">
                🎨 Tema AI yang Tersedia
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  {
                    name: "🎯 Umum & Netral",
                    desc: "Tim Alpha, Beta, Gamma",
                  },
                  {
                    name: "🦸 Superhero",
                    desc: "Tim Iron Shield, Thunder Strike",
                  },
                  { name: "⚡ Mitologi", desc: "Tim Zeus, Athena Wisdom" },
                  {
                    name: "💻 Teknologi",
                    desc: "Tim Innovator, Code Masters",
                  },
                  { name: "🌿 Alam", desc: "Tim Mountain Eagle, Ocean Wave" },
                  { name: "⚽ Olahraga", desc: "Tim Champions, Strikers" },
                  { name: "🔬 Sains", desc: "Tim Quantum, Catalyst" },
                  { name: "🎨 Seni", desc: "Tim Creative Spark, Artisan" },
                  {
                    name: "🍕 Makanan",
                    desc: "Tim Spicy Sambal, Sweet Martabak",
                  },
                  {
                    name: "🇮🇩 Budaya Indonesia",
                    desc: "Tim Garuda, Nusantara Jaya",
                  },
                ].map((theme, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border"
                  >
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {theme.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base flex items-center gap-2">
                ❓ FAQ Cepat
              </h4>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <strong className="text-sm">Berapa minimal peserta?</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimal 2 peserta untuk membuat kelompok.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <strong className="text-sm">Apakah AI gratis?</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ya, menggunakan Google Gemini AI 2.0 Flash.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <strong className="text-sm">Data disimpan di mana?</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hanya di browser Anda (localStorage). Tidak ada data yang
                    dikirim ke server.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border">
              <h4 className="font-semibold text-base mb-2 flex items-center gap-2">
                💡 Tips & Trik
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gunakan nama lengkap untuk hasil terbaik</li>
                <li>• Generate nama AI dulu sebelum acak kelompok</li>
                <li>• Simpan daftar peserta yang sering digunakan</li>
                <li>• Gunakan fitur ekspor untuk dokumentasi</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

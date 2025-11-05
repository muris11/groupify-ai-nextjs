"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  UserPlus,
  Upload,
  Save,
  RotateCcw,
  Settings,
  Shuffle,
  Lightbulb,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";

interface SavedList {
  id: string;
  name: string;
  names: string[];
  createdAt: string;
}

interface CreateGroupsTabProps {
  names: string;
  setNames: (names: string) => void;
  splitMode: "byGroups" | "byPeople";
  setSplitMode: (mode: "byGroups" | "byPeople") => void;
  splitValue: number;
  setSplitValue: (value: number) => void;
  showLeaders: boolean;
  setShowLeaders: (show: boolean) => void;
  groupTheme: "default" | "colors" | "animals" | "elements" | "space";
  setGroupTheme: (
    theme: "default" | "colors" | "animals" | "elements" | "space"
  ) => void;
  customGroupNames: string[];
  setCustomGroupNames: (names: string[]) => void;
  aiTheme: string;
  setAiTheme: (theme: string) => void;
  aiContext: string;
  setAiContext: (context: string) => void;
  isGeneratingAI: boolean;
  savedLists: SavedList[];
  setSavedLists: (lists: SavedList[]) => void;
  onCreateGroups: () => void;
  onSaveList: () => void;
  onResetAll: () => void;
  onFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateAITeamNames: () => void;
  isSpinning: boolean;
  cleanNames: (input: string) => string[];
}

export function CreateGroupsTab({
  names,
  setNames,
  splitMode,
  setSplitMode,
  splitValue,
  setSplitValue,
  showLeaders,
  setShowLeaders,
  groupTheme,
  setGroupTheme,
  customGroupNames,
  setCustomGroupNames,
  aiTheme,
  setAiTheme,
  aiContext,
  setAiContext,
  isGeneratingAI,
  savedLists,
  setSavedLists,
  onCreateGroups,
  onSaveList,
  onResetAll,
  onFileImport,
  onGenerateAITeamNames,
  isSpinning,
  cleanNames,
}: CreateGroupsTabProps) {
  const loadList = (list: SavedList) => {
    setNames(list.names.join("\n"));
  };

  const deleteList = (id: string) => {
    const updatedLists = savedLists.filter((list) => list.id !== id);
    setSavedLists(updatedLists);
    localStorage.setItem("savedLists", JSON.stringify(updatedLists));
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-3 sm:p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800 animate-slideIn">
        <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-2">
          <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
          Panduan Cepat
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span className="text-muted-foreground">
              Masukkan nama peserta (minimal 2 orang)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span className="text-muted-foreground">
              Atur jumlah kelompok & pilih tema AI (opsional)
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span className="text-muted-foreground">
              Klik "Acak Kelompok" dan lihat hasilnya!
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6">
        {/* Main Input Section */}
        <div className="xl:col-span-2 space-y-4 xl:space-y-6">
          <Card className="card-modern shadow-soft-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <Users className="w-5 h-5 text-purple-500" />
                  <span>Tambah Peserta</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {cleanNames(names).length} peserta
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="names" className="text-sm font-medium">
                  Nama (satu per baris)
                </Label>
                <Textarea
                  id="names"
                  placeholder="Ahmad Rizki&#10;Siti Fatimah&#10;Budi Santoso&#10;Dewi Lestari"
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  className="min-h-32 rounded-lg border-2 focus:border-purple-500 transition-all"
                />
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse-soft"></span>
                  {cleanNames(names).length} nama valid dimasukkan
                </p>
              </div>

              <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file-input")?.click()}
                  className="w-full sm:w-auto"
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Impor File</span>
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".txt,.csv"
                  onChange={onFileImport}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSaveList}
                  className="w-full sm:w-auto"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Simpan Daftar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetAll}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Reset Semua</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Split Settings */}
          <Card className="card-modern shadow-soft-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <Settings className="w-5 h-5 text-blue-500" />
                Pengaturan Kelompok
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={splitMode}
                onValueChange={(value) =>
                  setSplitMode(value as "byGroups" | "byPeople")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="byGroups" id="byGroups" />
                  <Label htmlFor="byGroups">
                    Bagi Berdasarkan Jumlah Kelompok
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="byPeople" id="byPeople" />
                  <Label htmlFor="byPeople">
                    Bagi Berdasarkan Orang per Kelompok
                  </Label>
                </div>
              </RadioGroup>

              <div className="space-y-3">
                <Label htmlFor="splitValue" className="text-sm font-medium">
                  {splitMode === "byGroups"
                    ? "Jumlah Kelompok"
                    : "Orang per Kelompok"}
                </Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSplitValue(Math.max(1, splitValue - 1))}
                    className="w-full sm:w-auto"
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Input
                    id="splitValue"
                    type="number"
                    min="1"
                    value={splitValue}
                    onChange={(e) =>
                      setSplitValue(parseInt(e.target.value) || 1)
                    }
                    className="w-full sm:w-20 text-center border-2 focus:border-blue-500"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSplitValue(splitValue + 1)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {/* Preview Info */}
                {cleanNames(names).length > 0 && (
                  <div className="text-xs sm:text-sm bg-blue-50 dark:bg-blue-950/20 p-2 sm:p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="font-medium">📊 Preview:</span>{" "}
                    {cleanNames(names).length} orang →{" "}
                    {splitMode === "byGroups"
                      ? `${Math.min(
                          splitValue,
                          cleanNames(names).length
                        )} kelompok`
                      : `${Math.ceil(
                          cleanNames(names).length / splitValue
                        )} kelompok`}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <Label className="text-sm">Tetapkan Ketua Tim</Label>
                  <Switch
                    checked={showLeaders}
                    onCheckedChange={setShowLeaders}
                  />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <Label className="text-sm">Tema Kelompok</Label>
                  <select
                    value={groupTheme}
                    onChange={(e) => setGroupTheme(e.target.value as any)}
                    className="px-3 py-2 border rounded-lg bg-background hover:border-primary transition-all text-sm"
                  >
                    <option value="default">Bawaan</option>
                    <option value="colors">Warna</option>
                    <option value="animals">Hewan</option>
                    <option value="elements">Elemen</option>
                    <option value="space">Luar Angkasa</option>
                  </select>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <Lightbulb className="w-5 h-5 text-purple-500" />
                    Nama Tim dengan AI (Opsional)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    AI akan membuat nama tim kreatif sesuai jumlah kelompok yang
                    Anda pilih
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="ai-theme">Tema AI</Label>
                    <select
                      id="ai-theme"
                      value={aiTheme}
                      onChange={(e) => setAiTheme(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-background"
                    >
                      <option value="umum">🎯 Umum & Netral</option>
                      <option value="superhero">🦸 Superhero & Pahlawan</option>
                      <option value="mitologi">⚡ Mitologi & Legenda</option>
                      <option value="teknologi">💻 Teknologi & Digital</option>
                      <option value="alam">🌿 Alam & Lingkungan</option>
                      <option value="olahraga">⚽ Olahraga & Tim</option>
                      <option value="sains">🔬 Sains & Inovasi</option>
                      <option value="seni">🎨 Seni & Kreativitas</option>
                      <option value="makanan">🍕 Makanan & Kuliner</option>
                      <option value="indonesia">🇮🇩 Budaya Indonesia</option>
                    </select>
                  </div>

                  <Button
                    onClick={onGenerateAITeamNames}
                    disabled={isGeneratingAI || cleanNames(names).length === 0}
                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGeneratingAI ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Membuat Nama Tim...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Nama Tim AI
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Shuffle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Buat Kelompok</span>
                </div>
                <Button
                  onClick={onCreateGroups}
                  disabled={isSpinning || cleanNames(names).length === 0}
                  className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-12 sm:h-14 text-sm sm:text-lg"
                  size="lg"
                >
                  {isSpinning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      <span className="text-sm sm:text-base">
                        Membuat Kelompok...
                      </span>
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="text-sm sm:text-base">
                        🎲 Acak Kelompok Sekarang
                      </span>
                    </>
                  )}
                </Button>
                {cleanNames(names).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Masukkan minimal 2 peserta untuk membuat kelompok
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Saved Lists */}
          {savedLists.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Daftar Tersimpan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  {savedLists.map((list) => (
                    <div
                      key={list.id}
                      className="flex items-center justify-between p-3 border rounded-lg mb-2 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{list.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {list.names.length} peserta •{" "}
                          {new Date(list.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadList(list)}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteList(list.id)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="card-modern shadow-soft bg-linear-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Tips Cerdas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-purple-500">💡</span> Gunakan impor file
                untuk daftar besar
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-500">💾</span> Simpan daftar yang
                sering digunakan
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500">👑</span> Aktifkan ketua tim
                untuk organisasi lebih baik
              </p>
              <p className="flex items-start gap-2">
                <span className="text-yellow-500">✨</span> Coba tema AI yang
                berbeda untuk nama kreatif
              </p>
              <p className="flex items-start gap-2">
                <span className="text-red-500">⚡</span> Atur batasan untuk
                kebutuhan khusus
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

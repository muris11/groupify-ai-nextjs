"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { ConstraintManager, Constraint } from "@/components/constraint-manager";
import { InteractiveGroupEditor } from "@/components/interactive-group-editor";
import { AppHeader } from "@/components/app/AppHeader";
import { GuideDialog } from "@/components/app/GuideDialog";
import { CreateGroupsTab } from "@/components/app/CreateGroupsTab";
import { ResultsTab } from "@/components/app/ResultsTab";
import { AIToolsTab } from "@/components/app/AIToolsTab";
import { AppFooter } from "@/components/app/AppFooter";
import {
  Shuffle,
  RefreshCw,
  Crown,
  Star,
  Copy,
  FileText,
  Download,
  Edit3,
  Brain,
  MessageCircle,
  Lightbulb,
  HelpCircle,
  Moon,
  Sun,
  Settings,
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  avatar?: string;
}

interface SavedList {
  id: string;
  name: string;
  names: string[];
  createdAt: string;
}

interface Icebreaker {
  groupIndex: number;
  question: string;
}

const GROUP_AVATARS = [
  "🦁",
  "🦅",
  "🐺",
  "🦊",
  "🐻",
  "🦌",
  "🐯",
  "🦄",
  "🐉",
  "🦅",
];
const GROUP_THEMES = {
  colors: [
    "Red Team",
    "Blue Team",
    "Green Team",
    "Yellow Team",
    "Purple Team",
    "Orange Team",
  ],
  animals: ["Lions", "Eagles", "Wolves", "Foxes", "Bears", "Deer"],
  elements: ["Fire", "Water", "Earth", "Air", "Lightning", "Ice"],
  space: ["Mars", "Venus", "Jupiter", "Saturn", "Neptune", "Mercury"],
};

export default function GroupSpinner() {
  const [names, setNames] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [splitMode, setSplitMode] = useState<"byGroups" | "byPeople">(
    "byGroups"
  );
  const [splitValue, setSplitValue] = useState<number>(3);
  const [isSpinning, setIsSpinning] = useState(false);
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [groupTheme, setGroupTheme] = useState<
    "default" | "colors" | "animals" | "elements" | "space"
  >("default");
  const [showLeaders, setShowLeaders] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [customGroupNames, setCustomGroupNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("create");
  const [enableInteractive, setEnableInteractive] = useState(false);
  const [icebreakers, setIcebreakers] = useState<Icebreaker[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiContext, setAiContext] = useState("");
  const [aiTheme, setAiTheme] = useState<string>("umum");
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("savedLists");
    if (saved) {
      setSavedLists(JSON.parse(saved));
    }
  }, []);

  const cleanNames = (input: string): string[] => {
    return input
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const applyConstraints = (names: string[]): string[] => {
    let constrainedNames = [...names];

    constraints.forEach((constraint) => {
      if (constraint.type === "together") {
        const group = constraint.names.join(" + ");
        constrainedNames = constrainedNames.filter(
          (name) => !constraint.names.includes(name)
        );
        constrainedNames.push(group);
      }
    });

    return constrainedNames;
  };

  const applySeparateConstraints = (groups: Group[]): Group[] => {
    const separateConstraints = constraints.filter(
      (c) => c.type === "separate"
    );

    separateConstraints.forEach((constraint) => {
      const memberGroups = constraint.names.map((name) => {
        const groupIndex = groups.findIndex((g) => g.members.includes(name));
        return { name, groupIndex };
      });

      const uniqueGroups = [
        ...new Set(memberGroups.map((mg) => mg.groupIndex)),
      ];

      if (uniqueGroups.length > 1) {
        return; // Already in different groups
      }

      // If all in same group, try to move them to different groups
      if (uniqueGroups.length === 1 && groups.length > 1) {
        const sourceGroupIndex = uniqueGroups[0];
        const sourceGroup = groups[sourceGroupIndex];

        constraint.names.forEach((name, index) => {
          if (index === 0) return; // Keep first one in place

          const targetGroupIndex = (sourceGroupIndex + index) % groups.length;
          if (targetGroupIndex !== sourceGroupIndex) {
            // Move the member to target group
            groups = groups.map((group, gIndex) => {
              if (gIndex === sourceGroupIndex) {
                return {
                  ...group,
                  members: group.members.filter((m) => m !== name),
                  leader: group.leader === name ? undefined : group.leader,
                };
              }
              if (gIndex === targetGroupIndex) {
                return { ...group, members: [...group.members, name] };
              }
              return group;
            });
          }
        });
      }
    });

    return groups;
  };

  const createGroups = () => {
    const cleanedNames = cleanNames(names);
    if (cleanedNames.length === 0) {
      toast({
        title: "Tidak ada nama",
        description:
          "Silakan masukkan setidaknya satu nama untuk membuat kelompok.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);

    setTimeout(() => {
      const constrainedNames = applyConstraints(cleanedNames);
      const shuffledNames = shuffleArray(constrainedNames);

      let newGroups: Group[] = [];

      if (splitMode === "byGroups") {
        const namesPerGroup = Math.ceil(shuffledNames.length / splitValue);
        for (let i = 0; i < splitValue; i++) {
          const start = i * namesPerGroup;
          const end = Math.min(start + namesPerGroup, shuffledNames.length);
          const members = shuffledNames.slice(start, end);

          if (members.length > 0) {
            newGroups.push({
              id: `group-${i}`,
              name: getGroupName(i),
              members,
              avatar: GROUP_AVATARS[i % GROUP_AVATARS.length],
            });
          }
        }
      } else {
        for (let i = 0; i < shuffledNames.length; i += splitValue) {
          const members = shuffledNames.slice(i, i + splitValue);
          const groupIndex = Math.floor(i / splitValue);

          newGroups.push({
            id: `group-${groupIndex}`,
            name: getGroupName(groupIndex),
            members,
            avatar: GROUP_AVATARS[groupIndex % GROUP_AVATARS.length],
          });
        }
      }

      // Apply separate constraints
      newGroups = applySeparateConstraints(newGroups);

      if (showLeaders) {
        newGroups = newGroups.map((group) => ({
          ...group,
          leader:
            group.members[Math.floor(Math.random() * group.members.length)],
        }));
      }

      setGroups(newGroups);
      setIsSpinning(false);
      setActiveTab("results");

      toast({
        title: "Kelompok berhasil dibuat!",
        description: `Berhasil membuat ${newGroups.length} kelompok.`,
      });
    }, 1500);
  };

  const getGroupName = (index: number): string => {
    if (customGroupNames[index]) {
      return customGroupNames[index];
    }

    if (groupTheme !== "default") {
      const themeNames = GROUP_THEMES[groupTheme];
      return themeNames[index % themeNames.length];
    }

    return `Group ${index + 1}`;
  };

  const resetAll = () => {
    setNames("");
    setGroups([]);
    setConstraints([]);
    setCustomGroupNames([]);
    toast({
      title: "Reset selesai",
      description: "Semua data telah dihapus.",
    });
  };

  const copyToClipboard = () => {
    const text = groups
      .map((group) => {
        let groupText = `${group.name} ${group.avatar || ""}\n`;
        if (group.leader) {
          groupText += `Leader: ${group.leader}\n`;
        }
        groupText += group.members.join("\n");
        return groupText;
      })
      .join("\n\n");

    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin ke clipboard",
      description: "Hasil telah disalin ke clipboard Anda.",
    });
  };

  const exportAsText = () => {
    const text = groups
      .map((group) => {
        let groupText = `${group.name} ${group.avatar || ""}\n`;
        if (group.leader) {
          groupText += `Leader: ${group.leader}\n`;
        }
        groupText += group.members.join("\n");
        return groupText;
      })
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "groups.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const csv =
      "Name,Group,Role\n" +
      groups
        .flatMap((group) =>
          group.members.map((member) => {
            let role = "Member";
            if (group.leader === member) role = "Leader";
            return `"${member}","${group.name}","${role}"`;
          })
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "groups.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveList = () => {
    const listName = prompt("Masukkan nama untuk daftar ini:");
    if (!listName) return;

    const cleanedNames = cleanNames(names);
    const newList: SavedList = {
      id: Date.now().toString(),
      name: listName,
      names: cleanedNames,
      createdAt: new Date().toISOString(),
    };

    const updatedLists = [...savedLists, newList];
    setSavedLists(updatedLists);
    localStorage.setItem("savedLists", JSON.stringify(updatedLists));

    toast({
      title: "Daftar tersimpan",
      description: `"${listName}" telah disimpan di browser Anda.`,
    });
  };

  const loadList = (list: SavedList) => {
    setNames(list.names.join("\n"));
    toast({
      title: "Daftar dimuat",
      description: `"${list.name}" telah dimuat.`,
    });
  };

  const deleteList = (id: string) => {
    const updatedLists = savedLists.filter((list) => list.id !== id);
    setSavedLists(updatedLists);
    localStorage.setItem("savedLists", JSON.stringify(updatedLists));

    toast({
      title: "Daftar dihapus",
      description: "Daftar telah dihapus dari browser Anda.",
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setNames(lines.join("\n"));

      toast({
        title: "File berhasil diimpor",
        description: `Berhasil mengimpor ${lines.length} nama.`,
      });
    };
    reader.readAsText(file);
  };

  const generateAITeamNames = async () => {
    if (cleanNames(names).length === 0) {
      toast({
        title: "Tidak Ada Nama",
        description:
          "Silakan masukkan nama terlebih dahulu untuk membuat nama tim dengan AI.",
        variant: "destructive",
      });
      return;
    }

    // Hitung jumlah kelompok yang akan dibuat
    const totalNames = cleanNames(names).length;
    const numberOfGroups =
      splitMode === "byGroups"
        ? Math.min(splitValue, totalNames)
        : Math.ceil(totalNames / splitValue);

    setIsGeneratingAI(true);

    try {
      const response = await fetch("/api/generate-team-names", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: numberOfGroups,
          theme: aiTheme,
          context: aiContext,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCustomGroupNames(data.teamNames);
        toast({
          title: "Nama Tim AI Berhasil Dibuat!",
          description: `Berhasil membuat ${data.teamNames.length} nama tim kreatif dengan tema "${aiTheme}".`,
        });
      } else {
        throw new Error(data.error || "Gagal membuat nama tim");
      }
    } catch (error) {
      console.error("Error generating AI team names:", error);
      toast({
        title: "Pembuatan AI Gagal",
        description: "Tidak dapat membuat nama tim. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateIcebreakers = async () => {
    if (groups.length === 0) {
      toast({
        title: "Tidak ada kelompok",
        description:
          "Silakan buat kelompok terlebih dahulu untuk membuat pertanyaan pemecah es.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);

    try {
      const response = await fetch("/api/generate-icebreakers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groups: groups.map((g) => g.members),
          context: aiContext,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIcebreakers(data.icebreakers);
        setActiveTab("ai");
        toast({
          title: "Pertanyaan Pemecah Es Berhasil Dibuat!",
          description: `Berhasil membuat ${data.icebreakers.length} pertanyaan pemecah es.`,
        });
      } else {
        throw new Error(data.error || "Gagal membuat pertanyaan pemecah es");
      }
    } catch (error) {
      toast({
        title: "Pembuatan AI Gagal",
        description:
          "Tidak dapat membuat pertanyaan pemecah es. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const smartBalanceGroups = async () => {
    if (groups.length === 0) {
      toast({
        title: "Tidak ada kelompok",
        description:
          "Silakan buat kelompok terlebih dahulu untuk menyeimbangkan.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingAI(true);

    try {
      const response = await fetch("/api/smart-balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          names: cleanNames(names),
          groups: groups.map((g) => g.members),
          attributes: {},
          balanceCriteria:
            "Buat kelompok yang seimbang dengan ukuran yang sama dan anggota yang beragam",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const balancedGroups = data.groups.map(
          (members: string[], index: number) => ({
            id: `group-${index}`,
            name: getGroupName(index),
            members,
            avatar: GROUP_AVATARS[index % GROUP_AVATARS.length],
            leader: showLeaders
              ? members[Math.floor(Math.random() * members.length)]
              : undefined,
          })
        );

        setGroups(balancedGroups);
        toast({
          title: "Kelompok Telah Diseimbangkan!",
          description:
            data.suggestion ||
            "Kelompok telah diseimbangkan ulang untuk keadilan.",
        });
      } else {
        throw new Error(data.error || "Gagal menyeimbangkan kelompok");
      }
    } catch (error) {
      toast({
        title: "AI Balancing Failed",
        description: "Could not balance groups. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <AppHeader onShowGuide={() => setShowGuide(true)} />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto p-1">
            <TabsTrigger
              value="create"
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-3"
            >
              <span className="hidden sm:inline">Buat Kelompok</span>
              <span className="sm:hidden">Buat</span>
            </TabsTrigger>
            <TabsTrigger
              value="constraints"
              disabled={groups.length === 0}
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-3"
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden md:inline">Batasan</span>
              <span className="md:hidden">Limit</span>
            </TabsTrigger>
            <TabsTrigger
              value="results"
              disabled={groups.length === 0}
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-3"
            >
              <span className="hidden sm:inline">Hasil</span>
              <span className="sm:hidden">Hasil</span>
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              disabled={groups.length === 0}
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-3"
            >
              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
              <span className="sm:hidden">Edit</span>
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              disabled={groups.length === 0}
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-3 col-span-2 sm:col-span-1"
            >
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Alat AI</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <CreateGroupsTab
              names={names}
              setNames={setNames}
              splitMode={splitMode}
              setSplitMode={setSplitMode}
              splitValue={splitValue}
              setSplitValue={setSplitValue}
              showLeaders={showLeaders}
              setShowLeaders={setShowLeaders}
              groupTheme={groupTheme}
              setGroupTheme={setGroupTheme}
              customGroupNames={customGroupNames}
              setCustomGroupNames={setCustomGroupNames}
              aiTheme={aiTheme}
              setAiTheme={setAiTheme}
              aiContext={aiContext}
              setAiContext={setAiContext}
              isGeneratingAI={isGeneratingAI}
              savedLists={savedLists}
              setSavedLists={setSavedLists}
              onCreateGroups={createGroups}
              onSaveList={saveList}
              onResetAll={resetAll}
              onFileImport={handleFileImport}
              onGenerateAITeamNames={generateAITeamNames}
              isSpinning={isSpinning}
              cleanNames={cleanNames}
            />
          </TabsContent>

          <TabsContent value="constraints">
            <ConstraintManager
              constraints={constraints}
              onConstraintsChange={setConstraints}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <ResultsTab
              groups={groups}
              onCopyToClipboard={copyToClipboard}
              onExportAsText={exportAsText}
              onExportAsCSV={exportAsCSV}
              onEditGroups={() => setActiveTab("edit")}
            />
          </TabsContent>

          <TabsContent value="edit">
            {groups.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Interactive Group Editor
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("results")}
                    >
                      Back to Results
                    </Button>
                    <Button onClick={createGroups}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Re-spin
                    </Button>
                  </div>
                </div>
                <InteractiveGroupEditor
                  groups={groups}
                  onGroupsChange={setGroups}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <AIToolsTab
              groups={groups}
              icebreakers={icebreakers}
              isGeneratingAI={isGeneratingAI}
              aiContext={aiContext}
              setAiContext={setAiContext}
              onSmartBalance={smartBalanceGroups}
              onGenerateIcebreakers={generateIcebreakers}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AppFooter />

      {/* Panduan Pengguna Dialog */}
      <Dialog open={showGuide} onOpenChange={setShowGuide}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <HelpCircle className="w-6 h-6 text-primary" />
              User Guide - Groupify AI
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-sm leading-relaxed">
            <div className="space-y-4">
              <div className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  🎯 Tentang Aplikasi
                </h3>
                <p className="text-muted-foreground">
                  <strong>Groupify AI</strong> is a web application that helps
                  you create random groups automatically with AI assistance.
                  Perfect for teachers, trainers, event organizers, or anyone
                  who needs to divide participants into fair and efficient
                  groups.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
    </div>
  );
}

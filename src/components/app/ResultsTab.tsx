"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Star,
  Copy,
  FileText,
  Download,
  Edit3,
  File,
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  avatar?: string;
}

interface ResultsTabProps {
  groups: Group[];
  onCopyToClipboard: () => void;
  onExportAsText: () => void;
  onExportAsCSV: () => void;
  onEditGroups: () => void;
}

export function ResultsTab({
  groups,
  onCopyToClipboard,
  onExportAsText,
  onExportAsCSV,
  onEditGroups,
}: ResultsTabProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleExportAsPDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);
    try {
      // Dynamically import libraries
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Create an isolated iframe without any external CSS
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.left = "-9999px";
      iframe.style.top = "0";
      iframe.style.width = "210mm";
      iframe.style.height = "297mm";
      document.body.appendChild(iframe);

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error("Cannot access iframe document");

      // Write clean HTML without any external CSS
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              background: white; 
              color: black;
              padding: 20px;
              width: 210mm;
            }
          </style>
        </head>
        <body>
          <div style="max-width: 100%; margin: 0 auto; font-family: Arial, sans-serif; color: #000000; background: white; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px; font-size: 28px; font-weight: bold;">
              Groupora AI - Hasil Kelompok
            </h1>
            <p style="text-align: center; color: #666666; margin-bottom: 40px; font-size: 14px;">
              Dibuat pada ${new Date().toLocaleDateString(
                "id-ID"
              )} ${new Date().toLocaleTimeString("id-ID")}
            </p>

            <div style="display: block;">
              ${groups
                .map(
                  (group) => `
                <div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; background: #f9fafb; margin-bottom: 20px;">
                  <div style="margin-bottom: 15px;">
                    <span style="font-size: 24px; margin-right: 10px;">${
                      group.avatar || "👥"
                    }</span>
                    <span style="color: #1f2937; font-size: 18px; font-weight: bold;">
                      ${group.name}${group.leader ? " 👑" : ""}
                    </span>
                    <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 10px;">
                      ${group.members.length} orang
                    </span>
                  </div>

                  ${
                    group.leader
                      ? `
                    <div style="background: #fef3c7; padding: 8px; border-radius: 6px; margin-bottom: 15px;">
                      <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 500;">
                        👑 Ketua: ${group.leader}
                      </p>
                    </div>
                  `
                      : ""
                  }

                  <div style="margin-top: 10px;">
                    ${group.members
                      .map(
                        (member) => `
                      <div style="margin-bottom: 8px;">
                        <span style="display: inline-block; width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
                        <span style="color: #374151; font-size: 14px; vertical-align: middle; ${
                          member === group.leader ? "font-weight: bold;" : ""
                        }">
                          ${member}
                        </span>
                      </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              `
                )
                .join("")}
            </div>

            <div style="margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                Dibuat dengan Groupora AI - Powered by Google Gemini AI
              </p>
            </div>
          </div>
        </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for iframe to fully render
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Convert iframe body to canvas
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `groupora-ai-hasil-kelompok-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );

      // Clean up
      document.body.removeChild(iframe);
    } catch (error) {
      console.error("Error generating PDF:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        groups: groups.length,
        isGeneratingPDF,
      });
      alert(
        `Terjadi kesalahan saat membuat PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Silakan coba lagi.`
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  return (
    <div className="space-y-6">
      {groups.length > 0 && (
        <Card className="card-modern shadow-soft-lg">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                Hasil Kelompok
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCopyToClipboard}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Salin</span>
                  <span className="xs:hidden">📋</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportAsText}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Ekspor TXT</span>
                  <span className="sm:hidden">TXT</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportAsCSV}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Ekspor CSV</span>
                  <span className="sm:hidden">CSV</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAsPDF}
                  disabled={isGeneratingPDF}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <File className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {isGeneratingPDF ? "Membuat PDF..." : "Ekspor PDF"}
                  </span>
                  <span className="sm:hidden">
                    {isGeneratingPDF ? "..." : "PDF"}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditGroups}
                  className="text-xs sm:text-sm px-2 sm:px-4"
                >
                  <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Edit Kelompok</span>
                  <span className="xs:hidden">Edit</span>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {groups.map((group, index) => (
                <Card
                  key={group.id}
                  className={`border-2 group-card animate-scaleIn hover-lift stagger-${Math.min(
                    index + 1,
                    5
                  )}`}
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-sm sm:text-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl">
                          {group.avatar}
                        </span>
                        <span className="truncate">{group.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs w-fit">
                        {group.members.length} orang
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {group.leader && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <span className="text-yellow-600">👑</span>
                        <span className="text-sm font-medium">
                          Ketua: {group.leader}
                        </span>
                      </div>
                    )}
                    <div className="space-y-1">
                      {group.members.map((member, memberIndex) => (
                        <div
                          key={memberIndex}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                            {memberIndex + 1}
                          </span>
                          <span className="text-sm">{member}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Statistik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total Kelompok:
              </span>
              <Badge variant="secondary">{groups.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total Orang:
              </span>
              <Badge variant="secondary">
                {groups.reduce((sum, g) => sum + g.members.length, 0)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Rata-rata per Kelompok:
              </span>
              <Badge variant="secondary">
                {Math.round(
                  groups.reduce((sum, g) => sum + g.members.length, 0) /
                    groups.length
                )}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Ukuran Kelompok:</p>
              {groups.map((group, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{group.name}:</span>
                  <Badge variant="outline">{group.members.length} orang</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

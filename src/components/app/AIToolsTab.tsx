"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, MessageCircle, Lightbulb, Zap, RefreshCw } from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  avatar?: string;
}

interface Icebreaker {
  groupIndex: number;
  question: string;
}

interface AIToolsTabProps {
  groups: Group[];
  icebreakers: Icebreaker[];
  isGeneratingAI: boolean;
  aiContext: string;
  setAiContext: (context: string) => void;
  onSmartBalance: () => void;
  onGenerateIcebreakers: () => void;
}

export function AIToolsTab({
  groups,
  icebreakers,
  isGeneratingAI,
  aiContext,
  setAiContext,
  onSmartBalance,
  onGenerateIcebreakers,
}: AIToolsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* AI Tools */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI-Powered Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={onSmartBalance}
                disabled={isGeneratingAI || groups.length === 0}
                className="w-full btn-gradient hover-glow"
                variant="outline"
                size="sm"
              >
                {isGeneratingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    <span className="text-sm">Menyeimbangkan...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    <span className="text-sm">Seimbangkan Kelompok Pintar</span>
                  </>
                )}
              </Button>

              <Button
                onClick={onGenerateIcebreakers}
                disabled={isGeneratingAI || groups.length === 0}
                className="w-full btn-gradient hover-glow"
                variant="outline"
                size="sm"
              >
                {isGeneratingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    <span className="text-sm">Membuat...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Buat Pertanyaan Pemecah Es</span>
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-context">Context (Optional)</Label>
              <Textarea
                id="ai-context"
                placeholder="Add context for better AI results (e.g., 'Corporate team building event', 'Classroom project', 'Sports team practice')"
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
                className="min-h-20"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Features Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Fitur AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Keseimbangan Pintar</h4>
              <p className="text-muted-foreground">
                Menggunakan AI untuk membuat kelompok yang seimbang dengan
                mempertimbangkan distribusi ukuran dan keragaman anggota.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Nama Tim Kreatif</h4>
              <p className="text-muted-foreground">
                Menghasilkan nama tim yang unik dan kreatif berdasarkan tema
                atau konteks yang Anda pilih.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Pertanyaan Pemecah Es</h4>
              <p className="text-muted-foreground">
                Membuat pertanyaan pemecah es yang menarik yang disesuaikan
                dengan kelompok dan konteks Anda.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Icebreakers Display */}
      <div className="space-y-6">
        {icebreakers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Pertanyaan Pemecah Es
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {icebreakers.map((icebreaker, index) => (
                    <Card key={index} className="border-l-4 border-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">
                              Kelompok {icebreaker.groupIndex + 1}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {icebreaker.question}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* AI Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isGeneratingAI
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-green-500"
                }`}
              ></div>
              <span className="text-sm">
                {isGeneratingAI ? "AI is processing..." : "AI is ready"}
              </span>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                AI features use advanced language models to enhance your group
                creation experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

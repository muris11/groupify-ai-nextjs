"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Users, UserX, Link2, Trash2, Plus } from "lucide-react";

export interface Constraint {
  id: string;
  type: "together" | "separate";
  names: string[];
}

interface ConstraintManagerProps {
  constraints: Constraint[];
  onConstraintsChange: (constraints: Constraint[]) => void;
}

export function ConstraintManager({
  constraints,
  onConstraintsChange,
}: ConstraintManagerProps) {
  const [newConstraintType, setNewConstraintType] = useState<
    "together" | "separate"
  >("together");
  const [newConstraintNames, setNewConstraintNames] = useState("");
  const { toast } = useToast();

  const addConstraint = () => {
    const names = newConstraintNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length < 2) {
      toast({
        title: "Batasan tidak valid",
        description:
          "Silakan masukkan minimal 2 nama yang dipisahkan dengan koma.",
        variant: "destructive",
      });
      return;
    }

    const newConstraint: Constraint = {
      id: Date.now().toString(),
      type: newConstraintType,
      names,
    };

    onConstraintsChange([...constraints, newConstraint]);
    setNewConstraintNames("");

    toast({
      title: "Batasan ditambahkan",
      description: `${names.length} nama harus ${
        newConstraintType === "together" ? "tetap bersama" : "dipisahkan"
      }.`,
    });
  };

  const removeConstraint = (id: string) => {
    onConstraintsChange(constraints.filter((c) => c.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Aturan Batasan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={newConstraintType === "together" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewConstraintType("together")}
            >
              <Users className="w-4 h-4 mr-2" />
              Harus Bersama
            </Button>
            <Button
              variant={newConstraintType === "separate" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewConstraintType("separate")}
            >
              <UserX className="w-4 h-4 mr-2" />
              Tidak Boleh Bersama
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Masukkan nama dipisahkan koma (mis. Ahmad, Siti)"
              value={newConstraintNames}
              onChange={(e) => setNewConstraintNames(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addConstraint()}
            />
            <Button onClick={addConstraint} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {constraints.length > 0 && (
          <div className="space-y-2">
            <Label>Batasan Aktif</Label>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {constraints.map((constraint) => (
                  <div
                    key={constraint.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      {constraint.type === "together" ? (
                        <Users className="w-4 h-4 text-green-600" />
                      ) : (
                        <UserX className="w-4 h-4 text-red-600" />
                      )}
                      <div className="flex flex-wrap gap-1">
                        {constraint.names.map((name, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Batasan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus batasan ini?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeConstraint(constraint.id)}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Cara kerja:</p>
          <ul className="space-y-1">
            <li>
              • <strong>Harus Bersama:</strong> Nama-nama ini akan diperlakukan
              sebagai satu kesatuan
            </li>
            <li>
              • <strong>Tidak Boleh Bersama:</strong> Nama-nama ini akan
              ditempatkan di kelompok yang berbeda
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

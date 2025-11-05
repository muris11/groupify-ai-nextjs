"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Crown, GripVertical, Edit2, UserPlus } from "lucide-react";

interface Group {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  avatar?: string;
}

interface DraggableGroupProps {
  group: Group;
  onGroupUpdate: (groupId: string, updates: Partial<Group>) => void;
}

function DraggableMember({
  member,
  groupId,
  isLeader,
  onMemberUpdate,
  onLeaderSelect,
}: {
  member: string;
  groupId: string;
  isLeader: boolean;
  onMemberUpdate: (groupId: string, oldName: string, newName: string) => void;
  onLeaderSelect: (groupId: string, member: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${groupId}-${member}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(member);

  const handleEdit = () => {
    if (editValue.trim() && editValue !== member) {
      onMemberUpdate(groupId, member, editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 rounded border bg-background ${
        isLeader
          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
          : ""
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {isLeader && <Crown className="w-4 h-4 text-yellow-500" />}

      {isEditing ? (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEdit}
          onKeyPress={(e) => e.key === "Enter" && handleEdit()}
          className="flex-1 h-8"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 cursor-pointer ${isLeader ? "font-medium" : ""}`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {member}
        </span>
      )}

      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLeaderSelect(groupId, member)}
        >
          <Crown className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function DraggableGroup({ group, onGroupUpdate }: DraggableGroupProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  const handleMemberUpdate = (oldName: string, newName: string) => {
    const updatedMembers = group.members.map((m) =>
      m === oldName ? newName : m
    );
    const updatedLeader = group.leader === oldName ? newName : group.leader;
    onGroupUpdate(group.id, { members: updatedMembers, leader: updatedLeader });
  };

  const handleLeaderSelect = (member: string) => {
    onGroupUpdate(group.id, { leader: member });
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const updatedMembers = [...group.members, newMemberName.trim()];
      onGroupUpdate(group.id, { members: updatedMembers });
      setNewMemberName("");
    }
  };

  const handleRemoveMember = (memberToRemove: string) => {
    const updatedMembers = group.members.filter((m) => m !== memberToRemove);
    const updatedLeader =
      group.leader === memberToRemove ? undefined : group.leader;
    onGroupUpdate(group.id, { members: updatedMembers, leader: updatedLeader });
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{group.avatar}</span>
            {isEditingName ? (
              <Input
                value={group.name}
                onChange={(e) =>
                  onGroupUpdate(group.id, { name: e.target.value })
                }
                onBlur={() => setIsEditingName(false)}
                onKeyPress={(e) => e.key === "Enter" && setIsEditingName(false)}
                className="h-8 w-32"
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => setIsEditingName(true)}>
                {group.name}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddMember(!showAddMember)}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {showAddMember && (
          <div className="flex gap-2 p-2 border rounded">
            <Input
              placeholder="New member name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
              className="flex-1 h-8"
            />
            <Button onClick={handleAddMember} size="sm">
              Add
            </Button>
          </div>
        )}

        <SortableContext
          items={group.members.map((m) => `${group.id}-${m}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {group.members.map((member) => (
              <DraggableMember
                key={`${group.id}-${member}`}
                member={member}
                groupId={group.id}
                isLeader={group.leader === member}
                onMemberUpdate={handleMemberUpdate}
                onLeaderSelect={handleLeaderSelect}
              />
            ))}
          </div>
        </SortableContext>

        <div className="pt-2 border-t">
          <Badge variant="outline" className="text-xs">
            {group.members.length} member{group.members.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface InteractiveGroupEditorProps {
  groups: Group[];
  onGroupsChange: (groups: Group[]) => void;
}

export function InteractiveGroupEditor({
  groups,
  onGroupsChange,
}: InteractiveGroupEditorProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Parse the IDs to get group and member info
    const [activeGroupId, activeMember] = activeId.split("-");
    const [overGroupId, overMember] = overId.split("-");

    if (activeGroupId === overGroupId) {
      // Reordering within the same group
      const group = groups.find((g) => g.id === activeGroupId);
      if (group) {
        const oldIndex = group.members.indexOf(activeMember);
        const newIndex = group.members.indexOf(overMember);
        const newMembers = arrayMove(group.members, oldIndex, newIndex);

        const updatedGroups = groups.map((g) =>
          g.id === activeGroupId ? { ...g, members: newMembers } : g
        );
        onGroupsChange(updatedGroups);
      }
    } else {
      // Moving to a different group
      const activeGroup = groups.find((g) => g.id === activeGroupId);
      const overGroup = groups.find((g) => g.id === overGroupId);

      if (activeGroup && overGroup) {
        const updatedGroups = groups.map((g) => {
          if (g.id === activeGroupId) {
            const newMembers = g.members.filter((m) => m !== activeMember);
            const newLeader = g.leader === activeMember ? undefined : g.leader;
            return { ...g, members: newMembers, leader: newLeader };
          }
          if (g.id === overGroupId) {
            return { ...g, members: [...g.members, activeMember] };
          }
          return g;
        });
        onGroupsChange(updatedGroups);
      }
    }

    setActiveId(null);
  };

  const handleGroupUpdate = (groupId: string, updates: Partial<Group>) => {
    const updatedGroups = groups.map((g) =>
      g.id === groupId ? { ...g, ...updates } : g
    );
    onGroupsChange(updatedGroups);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Interactive Editing:</p>
          <ul className="space-y-1">
            <li>• Drag names between groups to move them</li>
            <li>• Double-click names or group names to edit</li>
            <li>• Click the crown icon to assign a leader</li>
            <li>• Use the + button to add new members</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <DraggableGroup
              key={group.id}
              group={group}
              onGroupUpdate={handleGroupUpdate}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="flex items-center gap-2 p-2 rounded border bg-background shadow-lg">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            <span>{activeId.split("-")[1]}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

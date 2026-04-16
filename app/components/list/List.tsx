"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { List as ListType, Card as CardType, Label, Member } from "../../types";
import { Card } from "../card/Card";
import { MoreHorizontal, Plus, X } from "lucide-react";

interface ListProps {
  list: ListType;
  labels: Label[];
  members: Member[];
  onUpdate: (listId: string, title: string) => void;
  onDelete: (listId: string) => void;
  onCreateCard: (listId: string, title: string) => void;
  onCardClick: (card: CardType) => void;
}

export const List = ({
  list,
  labels,
  members,
  onUpdate,
  onDelete,
  onCreateCard,
  onCardClick,
}: ListProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id, data: { type: "List", list } });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: list.id,
    data: { type: "List", list },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveTitle = () => {
    if (title.trim()) {
      onUpdate(list.id, title.trim());
    } else {
      setTitle(list.title);
    }
    setIsEditing(false);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      onCreateCard(list.id, newCardTitle.trim());
      setNewCardTitle("");
      setShowAddCard(false);
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setSortableRef}
        style={style}
        className="w-72 shrink-0 opacity-60 rotate-3 scale-105"
        {...attributes}
        {...listeners}
      >
        <div className="bg-gradient-to-br from-yellow-100 to-pink-100 rounded-3xl p-4 max-h-[80vh] flex flex-col shadow-2xl border-4 border-dashed border-purple-300">
          <div className="h-8 bg-purple-200 rounded-full w-3/4 mb-3" />
          <div className="space-y-3">
            <div className="h-24 bg-white rounded-2xl shadow-sm" />
            <div className="h-24 bg-white rounded-2xl shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setSortableRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-72 shrink-0 hover:scale-[1.02] transition-transform"
    >
      <div className="bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 rounded-3xl max-h-[80vh] flex flex-col shadow-xl border-2 border-white/50">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") {
                  setTitle(list.title);
                  setIsEditing(false);
                }
              }}
              className="flex-1 px-3 py-2 text-base font-bold text-purple-700 bg-white border-4 border-pink-400 rounded-xl focus:outline-none shadow-inner"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => setIsEditing(true)}
              className="flex-1 text-base font-bold text-purple-700 cursor-pointer px-3 py-2 hover:bg-white/60 rounded-xl transition-colors"
            >
              📋 {list.title}
            </h3>
          )}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-purple-500 hover:bg-pink-200 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border-4 border-pink-200 py-2 z-20">
                <h4 className="px-4 py-2 text-xs font-bold text-pink-500 uppercase border-b-2 border-pink-100">
                  List Actions 🎯
                </h4>
                <button
                  onClick={() => {
                    onDelete(list.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 text-left transition-colors"
                >
                  🗑️ Delete this list
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cards */}
        <div
          ref={setDroppableRef}
          className="flex-1 overflow-y-auto px-4 pb-3 space-y-3 min-h-[50px]"
        >
          <SortableContext
            items={list.cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                labels={labels}
                members={members}
                onClick={() => onCardClick(card)}
              />
            ))}
          </SortableContext>
        </div>

        {/* Add Card */}
        <div className="p-4 pt-0">
          {showAddCard ? (
            <form onSubmit={handleCreateCard} className="space-y-3">
              <textarea
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateCard(e);
                  }
                }}
                placeholder="What needs to be done? 🤔"
                className="w-full px-4 py-3 text-base text-gray-800 bg-white border-4 border-orange-300 rounded-2xl resize-none focus:ring-4 focus:ring-pink-300 focus:border-pink-400 shadow-inner"
                rows={3}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-bold rounded-full hover:from-green-500 hover:to-blue-600 shadow-lg transform hover:scale-105 transition-all"
                >
                  Add Card! 🎉
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCard(false);
                    setNewCardTitle("");
                  }}
                  className="p-2.5 text-gray-500 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-purple-600 hover:bg-white/60 rounded-2xl text-base font-bold transition-all hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add a card! ✨
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

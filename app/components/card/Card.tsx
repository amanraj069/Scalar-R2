"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as CardType, Label, Member } from "../../types";
import { Calendar, AlignLeft, CheckSquare2 } from "lucide-react";
import { format } from "date-fns";

interface CardProps {
  card: CardType;
  labels: Label[];
  members: Member[];
  onClick: () => void;
}

export const Card = ({ card, labels, members, onClick }: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "Card", card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardLabels = labels.filter((l) => card.labelIds.includes(l.id));
  const cardMembers = members.filter((m) => card.memberIds.includes(m.id));
  const hasChecklists = card.checklists.length > 0;
  const completedItems = card.checklists.reduce(
    (acc, cl) => acc + cl.items.filter((i) => i.completed).length,
    0,
  );
  const totalItems = card.checklists.reduce(
    (acc, cl) => acc + cl.items.length,
    0,
  );
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-70 rotate-3 scale-105"
        {...attributes}
        {...listeners}
      >
        <div className="bg-white rounded-2xl shadow-xl border-4 border-dashed border-pink-300 p-4 min-h-[90px]">
          <div className="h-5 bg-pink-100 rounded-full w-3/4 mb-3" />
          <div className="h-4 bg-purple-100 rounded-full w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md border-2 border-purple-100 p-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:rotate-1 transition-all group"
    >
      {/* Labels */}
      {cardLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {cardLabels.map((label) => (
            <span
              key={label.id}
              className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: label.color }}
              title={label.name}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="text-base font-bold text-purple-800 mb-3 leading-snug">
        {card.title}
      </h4>

      {/* Badges */}
      <div className="flex items-center gap-3 text-purple-600 text-sm">
        {/* Due Date */}
        {card.dueDate && (
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs ${
              isOverdue
                ? "bg-red-100 text-red-600 border-2 border-red-300"
                : "bg-blue-100 text-blue-600 border-2 border-blue-300"
            }`}
          >
            <Calendar className="w-4 h-4" />
            {format(new Date(card.dueDate), "MMM d")}
            {isOverdue && " ⚠️"}
          </span>
        )}

        {/* Description */}
        {card.description && (
          <span className="flex items-center gap-1 bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full font-bold text-xs border-2 border-purple-300">
            <AlignLeft className="w-4 h-4" />
            📝
          </span>
        )}

        {/* Checklist */}
        {hasChecklists && (
          <span
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs border-2 ${
              completedItems === totalItems && totalItems > 0
                ? "bg-green-100 text-green-600 border-green-300"
                : "bg-orange-100 text-orange-600 border-orange-300"
            }`}
          >
            <CheckSquare2 className="w-4 h-4" />
            {completedItems}/{totalItems}
            {completedItems === totalItems && totalItems > 0 && " ✅"}
          </span>
        )}

        {/* Members */}
        {cardMembers.length > 0 && (
          <div className="flex -space-x-2 ml-auto">
            {cardMembers.slice(0, 3).map((member) => (
              <img
                key={member.id}
                src={
                  member.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
                }
                alt={member.name}
                className="w-8 h-8 rounded-full border-3 border-white bg-gray-100 shadow-sm"
                title={member.name}
              />
            ))}
            {cardMembers.length > 3 && (
              <span className="w-8 h-8 rounded-full border-3 border-white bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center text-xs text-white font-bold shadow-sm">
                +{cardMembers.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

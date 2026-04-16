'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType, Label, Member } from '../../types';
import { Calendar, AlignLeft, CheckSquare2 } from 'lucide-react';
import { format } from 'date-fns';

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
  } = useSortable({ id: card.id, data: { type: 'Card', card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardLabels = labels.filter(l => card.labelIds.includes(l.id));
  const cardMembers = members.filter(m => card.memberIds.includes(m.id));
  const hasChecklists = card.checklists.length > 0;
  const completedItems = card.checklists.reduce(
    (acc, cl) => acc + cl.items.filter(i => i.completed).length,
    0
  );
  const totalItems = card.checklists.reduce(
    (acc, cl) => acc + cl.items.length,
    0
  );
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 rotate-2"
        {...attributes}
        {...listeners}
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 min-h-[80px]">
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
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
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow group"
    >
      {/* Labels */}
      {cardLabels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {cardLabels.map(label => (
            <span
              key={label.id}
              className="h-2 w-8 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="text-sm font-medium text-gray-900 mb-2 leading-snug">
        {card.title}
      </h4>

      {/* Badges */}
      <div className="flex items-center gap-3 text-gray-500 text-xs">
        {/* Due Date */}
        {card.dueDate && (
          <span
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
              isOverdue
                ? 'bg-red-100 text-red-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-3 h-3" />
            {format(new Date(card.dueDate), 'MMM d')}
          </span>
        )}

        {/* Description */}
        {card.description && (
          <span className="flex items-center gap-1 hover:bg-gray-100 px-1.5 py-0.5 rounded">
            <AlignLeft className="w-3 h-3" />
          </span>
        )}

        {/* Checklist */}
        {hasChecklists && (
          <span
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
              completedItems === totalItems && totalItems > 0
                ? 'bg-green-100 text-green-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <CheckSquare2 className="w-3 h-3" />
            {completedItems}/{totalItems}
          </span>
        )}

        {/* Members */}
        {cardMembers.length > 0 && (
          <div className="flex -space-x-1 ml-auto">
            {cardMembers.slice(0, 3).map(member => (
              <img
                key={member.id}
                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                alt={member.name}
                className="w-6 h-6 rounded-full border-2 border-white bg-gray-100"
                title={member.name}
              />
            ))}
            {cardMembers.length > 3 && (
              <span className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                +{cardMembers.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { Card, Label, Member, Checklist, ChecklistItem } from '../../types';
import { X, AlignLeft, Calendar, CheckSquare2, User, Tag, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface CardModalProps {
  card: Card;
  labels: Label[];
  members: Member[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Card>) => void;
  onDelete: () => void;
  onAssignLabel: (labelId: string) => void;
  onRemoveLabel: (labelId: string) => void;
  onAssignMember: (memberId: string) => void;
  onRemoveMember: (memberId: string) => void;
  onCreateChecklist: (title: string) => void;
  onAddChecklistItem: (checklistId: string, text: string) => void;
  onToggleChecklistItem: (checklistId: string, itemId: string) => void;
  onDeleteChecklistItem: (checklistId: string, itemId: string) => void;
  onDeleteChecklist: (checklistId: string) => void;
}

export const CardModal = ({
  card,
  labels,
  members,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onAssignLabel,
  onRemoveLabel,
  onAssignMember,
  onRemoveMember,
  onCreateChecklist,
  onAddChecklistItem,
  onToggleChecklistItem,
  onDeleteChecklistItem,
  onDeleteChecklist,
}: CardModalProps) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.dueDate || '');
  const [showLabelMenu, setShowLabelMenu] = useState(false);
  const [showMemberMenu, setShowMemberMenu] = useState(false);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const cardLabels = labels.filter(l => card.labelIds.includes(l.id));
  const cardMembers = members.filter(m => card.memberIds.includes(m.id));

  const handleSave = () => {
    onUpdate({
      title,
      description: description || undefined,
      dueDate: dueDate || undefined,
    });
  };

  const handleCreateChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistTitle.trim()) {
      onCreateChecklist(newChecklistTitle.trim());
      setNewChecklistTitle('');
      setShowChecklistForm(false);
    }
  };

  const handleAddChecklistItem = (checklistId: string) => {
    const text = newChecklistItem[checklistId]?.trim();
    if (text) {
      onAddChecklistItem(checklistId, text);
      setNewChecklistItem({ ...newChecklistItem, [checklistId]: '' });
    }
  };

  const completedItems = card.checklists.reduce(
    (acc, cl) => acc + cl.items.filter(i => i.completed).length,
    0
  );
  const totalItems = card.checklists.reduce(
    (acc, cl) => acc + cl.items.length,
    0
  );
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b flex items-start justify-between">
          <div className="flex-1 pr-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              className="w-full text-xl font-semibold text-gray-900 border-none focus:ring-0 p-0"
              placeholder="Card title"
            />
            <p className="text-sm text-gray-500 mt-1">in list</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex gap-4">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Labels & Members */}
              {(cardLabels.length > 0 || cardMembers.length > 0) && (
                <div className="flex gap-6">
                  {cardLabels.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Labels</h5>
                      <div className="flex flex-wrap gap-1">
                        {cardLabels.map(label => (
                          <span
                            key={label.id}
                            className="px-3 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: label.color }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {cardMembers.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Members</h5>
                      <div className="flex -space-x-1">
                        {cardMembers.map(member => (
                          <img
                            key={member.id}
                            src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                            alt={member.name}
                            className="w-8 h-8 rounded-full border-2 border-white bg-gray-100"
                            title={member.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Due Date */}
              {card.dueDate && (
                <div>
                  <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Due Date</h5>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(card.dueDate), 'MMMM d, yyyy')}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlignLeft className="w-4 h-4 text-gray-600" />
                  <h5 className="text-sm font-medium text-gray-700">Description</h5>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSave}
                  placeholder="Add a more detailed description..."
                  className="w-full min-h-[100px] p-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Checklists */}
              {card.checklists.length > 0 && (
                <div className="space-y-4">
                  {card.checklists.map((checklist: Checklist) => (
                    <div key={checklist.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckSquare2 className="w-4 h-4 text-gray-600" />
                          <h5 className="text-sm font-medium text-gray-700">{checklist.title}</h5>
                        </div>
                        <button
                          onClick={() => onDeleteChecklist(checklist.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress */}
                      {checklist.items.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gray-500 w-8">
                            {Math.round(
                              (checklist.items.filter(i => i.completed).length / checklist.items.length) * 100
                            )}%
                          </span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all"
                              style={{
                                width: `${
                                  (checklist.items.filter(i => i.completed).length / checklist.items.length) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-1">
                        {checklist.items.map((item: ChecklistItem) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2 group hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => onToggleChecklistItem(checklist.id, item.id)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                              {item.text}
                            </span>
                            <button
                              onClick={() => onDeleteChecklistItem(checklist.id, item.id)}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Item */}
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={newChecklistItem[checklist.id] || ''}
                          onChange={(e) => setNewChecklistItem({ ...newChecklistItem, [checklist.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem(checklist.id)}
                          placeholder="Add an item..."
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleAddChecklistItem(checklist.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-40 space-y-2">
              <h5 className="text-xs font-medium text-gray-500 uppercase">Add to card</h5>

              {/* Members Button */}
              <div className="relative">
                <button
                  onClick={() => setShowMemberMenu(!showMemberMenu)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Members
                </button>
                {showMemberMenu && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <h6 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase border-b">Members</h6>
                    {members.map(member => (
                      <button
                        key={member.id}
                        onClick={() => {
                          if (card.memberIds.includes(member.id)) {
                            onRemoveMember(member.id);
                          } else {
                            onAssignMember(member.id);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <img
                          src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                          alt={member.name}
                          className="w-6 h-6 rounded-full bg-gray-100"
                        />
                        <span className="flex-1 text-left">{member.name}</span>
                        {card.memberIds.includes(member.id) && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Labels Button */}
              <div className="relative">
                <button
                  onClick={() => setShowLabelMenu(!showLabelMenu)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <Tag className="w-4 h-4" />
                  Labels
                </button>
                {showLabelMenu && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <h6 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase border-b">Labels</h6>
                    {labels.map(label => (
                      <button
                        key={label.id}
                        onClick={() => {
                          if (card.labelIds.includes(label.id)) {
                            onRemoveLabel(label.id);
                          } else {
                            onAssignLabel(label.id);
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: label.color }}
                        />
                        <span className="flex-1 text-left">{label.name}</span>
                        {card.labelIds.includes(label.id) && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Due Date */}
              <div className="relative">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  Due Date
                </button>
                <input
                  type="date"
                  value={dueDate ? dueDate.split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value;
                    setDueDate(date ? new Date(date).toISOString() : '');
                    onUpdate({ dueDate: date ? new Date(date).toISOString() : undefined });
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {/* Checklist */}
              <button
                onClick={() => setShowChecklistForm(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <CheckSquare2 className="w-4 h-4" />
                Checklist
              </button>

              {showChecklistForm && (
                <form onSubmit={handleCreateChecklist} className="mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
                  <input
                    type="text"
                    value={newChecklistTitle}
                    onChange={(e) => setNewChecklistTitle(e.target.value)}
                    placeholder="Checklist title"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowChecklistForm(false)}
                      className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-100 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="border-t pt-4 mt-4">
                <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">Actions</h5>
                <button
                  onClick={onDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

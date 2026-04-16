"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Board as BoardType,
  Card as CardType,
  List as ListType,
  Label,
  Member,
} from "../../types";
import { List } from "../list/List";
import { Card } from "../card/Card";
import { CardModal } from "../card/CardModal";
import { Plus, Search, Filter, X } from "lucide-react";
import { useBoard } from "../../hooks/useBoard";
import { FilterOptions } from "../../types";

export const Board = () => {
  const {
    board,
    members,
    isLoading,
    createList,
    updateList,
    deleteList,
    reorderLists,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards,
    assignLabelToCard,
    removeLabelFromCard,
    assignMemberToCard,
    removeMemberFromCard,
    createChecklist,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    deleteChecklist,
    getFilteredCards,
  } = useBoard();

  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [activeList, setActiveList] = useState<ListType | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<FilterOptions>({});
  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "Card") {
      setActiveCard(activeData.card);
    } else if (activeData?.type === "List") {
      setActiveList(activeData.list);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "Card" && overData?.type === "List") {
      const cardId = activeId as string;
      const targetListId = overId as string;
      moveCard(cardId, targetListId, 0);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveCard(null);
    setActiveList(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "Card" && overData?.type === "Card") {
      const activeCardId = activeId as string;
      const overCardId = overId as string;

      // Find which list contains these cards
      const activeList = board?.lists.find((l) =>
        l.cards.some((c) => c.id === activeCardId),
      );
      const overList = board?.lists.find((l) =>
        l.cards.some((c) => c.id === overCardId),
      );

      if (activeList && overList) {
        const activeIndex = activeList.cards.findIndex(
          (c) => c.id === activeCardId,
        );
        const overIndex = overList.cards.findIndex((c) => c.id === overCardId);

        if (activeList.id === overList.id) {
          // Reorder within same list
          const newCardIds = arrayMove(
            activeList.cards.map((c) => c.id),
            activeIndex,
            overIndex,
          );
          reorderCards(activeList.id, newCardIds);
        } else {
          // Move to different list
          moveCard(activeCardId, overList.id, overIndex);
        }
      }
    } else if (activeData?.type === "List" && overData?.type === "List") {
      const activeListId = activeId as string;
      const overListId = overId as string;

      if (board) {
        const activeIndex = board.lists.findIndex((l) => l.id === activeListId);
        const overIndex = board.lists.findIndex((l) => l.id === overListId);
        const newListIds = arrayMove(
          board.lists.map((l) => l.id),
          activeIndex,
          overIndex,
        );
        reorderLists(newListIds);
      }
    }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim()) {
      createList(newListTitle.trim());
      setNewListTitle("");
      setShowAddList(false);
    }
  };

  // Filter cards
  const filteredCards = useMemo(() => {
    const searchFilter: FilterOptions = {
      ...filter,
      search: searchQuery,
    };
    return getFilteredCards(searchFilter);
  }, [filter, searchQuery, getFilteredCards]);

  // Get filtered lists with only filtered cards visible
  const filteredLists = useMemo(() => {
    if (!board) return [];
    if (
      !searchQuery &&
      !filter.labelIds?.length &&
      !filter.memberIds?.length &&
      !filter.dueDate
    ) {
      return board.lists;
    }

    const filteredCardIds = new Set(filteredCards.map((c) => c.id));
    return board.lists.map((list) => ({
      ...list,
      cards: list.cards.filter((c) => filteredCardIds.has(c.id)),
    }));
  }, [board, filteredCards, searchQuery, filter]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center fun-gradient">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading... 🎨
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="h-screen flex items-center justify-center fun-gradient">
        <div className="text-white text-xl font-bold">No board found 🙈</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col fun-gradient">
      {/* Header */}
      <header className="h-16 bg-white/20 backdrop-blur-md flex items-center justify-between px-6 shrink-0 border-b-4 border-white/30">
        <h1 className="text-white font-bold text-2xl drop-shadow-lg">
          🎯 {board.title}
        </h1>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards..."
              className="pl-9 pr-4 py-2 bg-white rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-400 w-52 shadow-lg border-2 border-transparent focus:border-pink-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg ${
              showFilter ||
              filter.labelIds?.length ||
              filter.memberIds?.length ||
              filter.dueDate
                ? "bg-yellow-300 text-purple-700 rotate-1"
                : "bg-white/30 text-white hover:bg-white/50 hover:rotate-1"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter ✨
          </button>
        </div>
      </header>

      {/* Filter Panel */}
      {showFilter && (
        <div className="bg-white/95 backdrop-blur-sm border-b px-4 py-3">
          <div className="flex items-center gap-6">
            {/* Label Filter */}
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                Labels
              </span>
              <div className="flex flex-wrap gap-1">
                {board.labels.map((label) => {
                  const isSelected = filter.labelIds?.includes(label.id);
                  return (
                    <button
                      key={label.id}
                      onClick={() => {
                        const currentIds = filter.labelIds || [];
                        const newIds = isSelected
                          ? currentIds.filter((id) => id !== label.id)
                          : [...currentIds, label.id];
                        setFilter({ ...filter, labelIds: newIds });
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium text-white transition-transform ${
                        isSelected
                          ? "ring-2 ring-offset-1 ring-gray-400 scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Member Filter */}
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                Members
              </span>
              <div className="flex -space-x-1">
                {members.map((member) => {
                  const isSelected = filter.memberIds?.includes(member.id);
                  return (
                    <button
                      key={member.id}
                      onClick={() => {
                        const currentIds = filter.memberIds || [];
                        const newIds = isSelected
                          ? currentIds.filter((id) => id !== member.id)
                          : [...currentIds, member.id];
                        setFilter({ ...filter, memberIds: newIds });
                      }}
                      className={`relative w-8 h-8 rounded-full border-2 border-white bg-gray-100 transition-transform ${
                        isSelected
                          ? "ring-2 ring-blue-500 scale-110 z-10"
                          : "hover:scale-105"
                      }`}
                    >
                      <img
                        src={
                          member.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
                        }
                        alt={member.name}
                        className="w-full h-full rounded-full"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date Filter */}
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase mb-1 block">
                Due Date
              </span>
              <select
                value={filter.dueDate || ""}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    dueDate: e.target.value as FilterOptions["dueDate"],
                  })
                }
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="overdue">Overdue</option>
                <option value="today">Due Today</option>
                <option value="week">Due This Week</option>
                <option value="none">No Due Date</option>
              </select>
            </div>

            {/* Clear Filter */}
            {(filter.labelIds?.length ||
              filter.memberIds?.length ||
              filter.dueDate) && (
              <button
                onClick={() => setFilter({})}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-start gap-4 p-4 h-full">
            <SortableContext
              items={filteredLists.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              {filteredLists.map((list) => (
                <List
                  key={list.id}
                  list={list}
                  labels={board.labels}
                  members={members}
                  onUpdate={updateList}
                  onDelete={deleteList}
                  onCreateCard={createCard}
                  onCardClick={setSelectedCard}
                />
              ))}
            </SortableContext>

            {/* Add List */}
            <div className="w-72 shrink-0">
              {showAddList ? (
                <form
                  onSubmit={handleCreateList}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border-4 border-dashed border-pink-400 rotate-1"
                >
                  <input
                    type="text"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="What shall we call it? 📝"
                    className="w-full px-4 py-3 text-sm text-gray-800 bg-yellow-50 border-2 border-orange-300 rounded-xl focus:ring-4 focus:ring-pink-300 focus:border-pink-400 mb-3 font-bold"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold rounded-full hover:from-pink-600 hover:to-purple-600 shadow-lg transform hover:scale-105 transition-all"
                    >
                      Add List! 🚀
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddList(false);
                        setNewListTitle("");
                      }}
                      className="p-2.5 text-gray-500 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowAddList(true)}
                  className="w-full flex items-center gap-2 px-5 py-4 bg-white/30 hover:bg-white/50 text-white rounded-2xl text-base font-bold transition-all transform hover:scale-105 hover:rotate-1 shadow-lg border-2 border-dashed border-white/50"
                >
                  <Plus className="w-5 h-5" />
                  Add another list! ✨
                </button>
              )}
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay dropAnimation={dropAnimation}>
            {activeCard ? (
              <Card
                card={activeCard}
                labels={board.labels}
                members={members}
                onClick={() => {}}
              />
            ) : activeList ? (
              <div className="w-72 shrink-0 opacity-90 rotate-2">
                <div className="bg-gray-100 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">
                    {activeList.title}
                  </h3>
                  <div className="space-y-2">
                    {activeList.cards.map((card) => (
                      <div key={card.id} className="h-20 bg-gray-200 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Card Modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          labels={board.labels}
          members={members}
          isOpen={true}
          onClose={() => setSelectedCard(null)}
          onUpdate={(updates) => {
            updateCard(selectedCard.id, updates);
            setSelectedCard({ ...selectedCard, ...updates });
          }}
          onDelete={() => {
            deleteCard(selectedCard.id);
            setSelectedCard(null);
          }}
          onAssignLabel={(labelId) => {
            assignLabelToCard(selectedCard.id, labelId);
            if (!selectedCard.labelIds.includes(labelId)) {
              setSelectedCard({
                ...selectedCard,
                labelIds: [...selectedCard.labelIds, labelId],
              });
            }
          }}
          onRemoveLabel={(labelId) => {
            removeLabelFromCard(selectedCard.id, labelId);
            setSelectedCard({
              ...selectedCard,
              labelIds: selectedCard.labelIds.filter((id) => id !== labelId),
            });
          }}
          onAssignMember={(memberId) => {
            assignMemberToCard(selectedCard.id, memberId);
            if (!selectedCard.memberIds.includes(memberId)) {
              setSelectedCard({
                ...selectedCard,
                memberIds: [...selectedCard.memberIds, memberId],
              });
            }
          }}
          onRemoveMember={(memberId) => {
            removeMemberFromCard(selectedCard.id, memberId);
            setSelectedCard({
              ...selectedCard,
              memberIds: selectedCard.memberIds.filter((id) => id !== memberId),
            });
          }}
          onCreateChecklist={(title) => {
            createChecklist(selectedCard.id, title);
            const newChecklist = {
              id: Date.now().toString(),
              title,
              items: [],
            };
            setSelectedCard({
              ...selectedCard,
              checklists: [...selectedCard.checklists, newChecklist],
            });
          }}
          onAddChecklistItem={(checklistId, text) => {
            addChecklistItem(selectedCard.id, checklistId, text);
            setSelectedCard({
              ...selectedCard,
              checklists: selectedCard.checklists.map((cl) =>
                cl.id === checklistId
                  ? {
                      ...cl,
                      items: [
                        ...cl.items,
                        { id: Date.now().toString(), text, completed: false },
                      ],
                    }
                  : cl,
              ),
            });
          }}
          onToggleChecklistItem={(checklistId, itemId) => {
            toggleChecklistItem(selectedCard.id, checklistId, itemId);
            setSelectedCard({
              ...selectedCard,
              checklists: selectedCard.checklists.map((cl) =>
                cl.id === checklistId
                  ? {
                      ...cl,
                      items: cl.items.map((item) =>
                        item.id === itemId
                          ? { ...item, completed: !item.completed }
                          : item,
                      ),
                    }
                  : cl,
              ),
            });
          }}
          onDeleteChecklistItem={(checklistId, itemId) => {
            deleteChecklistItem(selectedCard.id, checklistId, itemId);
            setSelectedCard({
              ...selectedCard,
              checklists: selectedCard.checklists.map((cl) =>
                cl.id === checklistId
                  ? {
                      ...cl,
                      items: cl.items.filter((item) => item.id !== itemId),
                    }
                  : cl,
              ),
            });
          }}
          onDeleteChecklist={(checklistId) => {
            deleteChecklist(selectedCard.id, checklistId);
            setSelectedCard({
              ...selectedCard,
              checklists: selectedCard.checklists.filter(
                (cl) => cl.id !== checklistId,
              ),
            });
          }}
        />
      )}
    </div>
  );
};

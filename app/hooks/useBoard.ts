'use client';

import { useState, useEffect, useCallback } from 'react';
import { Board, List, Card, Label, Member, FilterOptions } from '../types';
import * as store from '../lib/store';

export const useBoard = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load board on mount
  useEffect(() => {
    const loadedBoard = store.getBoard();
    const loadedMembers = store.getMembers();
    setBoard(loadedBoard);
    setMembers(loadedMembers);
    setIsLoading(false);
  }, []);

  // Refresh board data
  const refreshBoard = useCallback(() => {
    const loadedBoard = store.getBoard();
    setBoard(loadedBoard);
  }, []);

  // Board operations
  const updateBoardTitle = useCallback((title: string) => {
    if (!board) return;
    store.updateBoardTitle(board.id, title);
    refreshBoard();
  }, [board, refreshBoard]);

  // List operations
  const createList = useCallback((title: string) => {
    if (!board) return;
    store.createList(board.id, title);
    refreshBoard();
  }, [board, refreshBoard]);

  const updateList = useCallback((listId: string, title: string) => {
    if (!board) return;
    store.updateList(board.id, listId, title);
    refreshBoard();
  }, [board, refreshBoard]);

  const deleteList = useCallback((listId: string) => {
    if (!board) return;
    store.deleteList(board.id, listId);
    refreshBoard();
  }, [board, refreshBoard]);

  const reorderLists = useCallback((listIds: string[]) => {
    if (!board) return;
    store.reorderLists(board.id, listIds);
    refreshBoard();
  }, [board, refreshBoard]);

  // Card operations
  const createCard = useCallback((listId: string, title: string) => {
    store.createCard(listId, title);
    refreshBoard();
  }, [refreshBoard]);

  const updateCard = useCallback((cardId: string, updates: Partial<Card>) => {
    store.updateCard(cardId, updates);
    refreshBoard();
  }, [refreshBoard]);

  const deleteCard = useCallback((cardId: string) => {
    store.deleteCard(cardId);
    refreshBoard();
  }, [refreshBoard]);

  const moveCard = useCallback((cardId: string, targetListId: string, targetIndex: number) => {
    store.moveCard(cardId, targetListId, targetIndex);
    refreshBoard();
  }, [refreshBoard]);

  const reorderCards = useCallback((listId: string, cardIds: string[]) => {
    store.reorderCards(listId, cardIds);
    refreshBoard();
  }, [refreshBoard]);

  // Label operations
  const createLabel = useCallback((name: string, color: string) => {
    if (!board) return;
    store.createLabel(board.id, name, color);
    refreshBoard();
  }, [board, refreshBoard]);

  const assignLabelToCard = useCallback((cardId: string, labelId: string) => {
    store.assignLabelToCard(cardId, labelId);
    refreshBoard();
  }, [refreshBoard]);

  const removeLabelFromCard = useCallback((cardId: string, labelId: string) => {
    store.removeLabelFromCard(cardId, labelId);
    refreshBoard();
  }, [refreshBoard]);

  // Member operations
  const assignMemberToCard = useCallback((cardId: string, memberId: string) => {
    store.assignMemberToCard(cardId, memberId);
    refreshBoard();
  }, [refreshBoard]);

  const removeMemberFromCard = useCallback((cardId: string, memberId: string) => {
    store.removeMemberFromCard(cardId, memberId);
    refreshBoard();
  }, [refreshBoard]);

  // Checklist operations
  const createChecklist = useCallback((cardId: string, title: string) => {
    store.createChecklist(cardId, title);
    refreshBoard();
  }, [refreshBoard]);

  const addChecklistItem = useCallback((cardId: string, checklistId: string, text: string) => {
    store.addChecklistItem(cardId, checklistId, text);
    refreshBoard();
  }, [refreshBoard]);

  const toggleChecklistItem = useCallback((cardId: string, checklistId: string, itemId: string) => {
    store.toggleChecklistItem(cardId, checklistId, itemId);
    refreshBoard();
  }, [refreshBoard]);

  const deleteChecklistItem = useCallback((cardId: string, checklistId: string, itemId: string) => {
    store.deleteChecklistItem(cardId, checklistId, itemId);
    refreshBoard();
  }, [refreshBoard]);

  const deleteChecklist = useCallback((cardId: string, checklistId: string) => {
    store.deleteChecklist(cardId, checklistId);
    refreshBoard();
  }, [refreshBoard]);

  // Filter cards
  const getFilteredCards = useCallback((filter: FilterOptions): Card[] => {
    if (!board) return [];
    
    const allCards = board.lists.flatMap(list => list.cards);
    
    return allCards.filter(card => {
      // Search filter
      if (filter.search && !card.title.toLowerCase().includes(filter.search.toLowerCase())) {
        return false;
      }
      
      // Label filter
      if (filter.labelIds && filter.labelIds.length > 0) {
        if (!filter.labelIds.some(id => card.labelIds.includes(id))) {
          return false;
        }
      }
      
      // Member filter
      if (filter.memberIds && filter.memberIds.length > 0) {
        if (!filter.memberIds.some(id => card.memberIds.includes(id))) {
          return false;
        }
      }
      
      // Due date filter
      if (filter.dueDate) {
        const now = new Date();
        const cardDueDate = card.dueDate ? new Date(card.dueDate) : null;
        
        switch (filter.dueDate) {
          case 'overdue':
            if (!cardDueDate || cardDueDate >= now) return false;
            break;
          case 'today':
            if (!cardDueDate || cardDueDate.toDateString() !== now.toDateString()) return false;
            break;
          case 'week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (!cardDueDate || cardDueDate > weekFromNow) return false;
            break;
          case 'none':
            if (cardDueDate) return false;
            break;
        }
      }
      
      return true;
    });
  }, [board]);

  return {
    board,
    members,
    isLoading,
    refreshBoard,
    updateBoardTitle,
    createList,
    updateList,
    deleteList,
    reorderLists,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    reorderCards,
    createLabel,
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
  };
};

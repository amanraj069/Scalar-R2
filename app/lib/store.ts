import { Board, List, Card, Label, Member, Checklist, ChecklistItem } from '../types';

const STORAGE_KEY = 'trello-clone-data';
const MEMBERS_KEY = 'trello-clone-members';

// Sample members
const defaultMembers: Member[] = [
  { id: 'm1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 'm2', name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: 'm3', name: 'Carol Williams', email: 'carol@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
  { id: 'm4', name: 'David Brown', email: 'david@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
];

// Generate unique ID
export const generateId = () => Math.random().toString(36).substring(2, 9);

// Initialize sample data
export const initializeData = (): Board => {
  const boardId = generateId();
  const now = new Date().toISOString();

  const labels: Label[] = [
    { id: generateId(), name: 'High Priority', color: '#ef4444', boardId },
    { id: generateId(), name: 'Medium Priority', color: '#f59e0b', boardId },
    { id: generateId(), name: 'Low Priority', color: '#22c55e', boardId },
    { id: generateId(), name: 'Bug', color: '#dc2626', boardId },
    { id: generateId(), name: 'Feature', color: '#3b82f6', boardId },
    { id: generateId(), name: 'Design', color: '#a855f7', boardId },
  ];

  const lists: List[] = [
    {
      id: generateId(),
      title: 'To Do',
      boardId,
      position: 0,
      cards: [
        {
          id: generateId(),
          title: 'Research competitor products',
          description: 'Analyze top 5 competitors and their features',
          listId: '', // Will be set after list creation
          position: 0,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
          updatedAt: now,
          labelIds: [labels[4].id],
          memberIds: ['m1'],
          checklists: [],
        },
        {
          id: generateId(),
          title: 'Create wireframes',
          description: 'Design initial wireframes for all screens',
          listId: '',
          position: 1,
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
          updatedAt: now,
          labelIds: [labels[5].id],
          memberIds: ['m2'],
          checklists: [],
        },
      ],
    },
    {
      id: generateId(),
      title: 'In Progress',
      boardId,
      position: 1,
      cards: [
        {
          id: generateId(),
          title: 'Set up development environment',
          description: 'Configure local dev environment and tools',
          listId: '',
          position: 0,
          createdAt: now,
          updatedAt: now,
          labelIds: [labels[0].id],
          memberIds: ['m3'],
          checklists: [
            {
              id: generateId(),
              title: 'Setup Tasks',
              items: [
                { id: generateId(), text: 'Install Node.js', completed: true },
                { id: generateId(), text: 'Install VS Code extensions', completed: true },
                { id: generateId(), text: 'Configure Git', completed: false },
                { id: generateId(), text: 'Set up database', completed: false },
              ],
            },
          ],
        },
        {
          id: generateId(),
          title: 'Design system components',
          description: 'Create reusable UI component library',
          listId: '',
          position: 1,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
          updatedAt: now,
          labelIds: [labels[5].id],
          memberIds: ['m1', 'm3'],
          checklists: [],
        },
      ],
    },
    {
      id: generateId(),
      title: 'Review',
      boardId,
      position: 2,
      cards: [
        {
          id: generateId(),
          title: 'Fix navigation bug',
          description: 'Mobile menu not closing on link click',
          listId: '',
          position: 0,
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
          updatedAt: now,
          labelIds: [labels[3].id, labels[0].id],
          memberIds: ['m4'],
          checklists: [],
        },
      ],
    },
    {
      id: generateId(),
      title: 'Done',
      boardId,
      position: 3,
      cards: [
        {
          id: generateId(),
          title: 'Project kickoff meeting',
          description: 'Initial team meeting and planning session',
          listId: '',
          position: 0,
          createdAt: now,
          updatedAt: now,
          labelIds: [labels[2].id],
          memberIds: ['m1', 'm2', 'm3', 'm4'],
          checklists: [],
        },
      ],
    },
  ];

  // Set listId for all cards
  lists.forEach(list => {
    list.cards.forEach(card => {
      card.listId = list.id;
    });
  });

  const board: Board = {
    id: boardId,
    title: 'Product Launch Project',
    createdAt: now,
    updatedAt: now,
    lists,
    labels,
  };

  return board;
};

// Get board from localStorage
export const getBoard = (): Board | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const newBoard = initializeData();
    saveBoard(newBoard);
    return newBoard;
  }
  return JSON.parse(data);
};

// Save board to localStorage
export const saveBoard = (board: Board): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
};

// Get members from localStorage
export const getMembers = (): Member[] => {
  if (typeof window === 'undefined') return defaultMembers;
  const data = localStorage.getItem(MEMBERS_KEY);
  if (!data) {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(defaultMembers));
    return defaultMembers;
  }
  return JSON.parse(data);
};

// Board operations
export const updateBoardTitle = (boardId: string, title: string): Board | null => {
  const board = getBoard();
  if (!board || board.id !== boardId) return null;
  board.title = title;
  board.updatedAt = new Date().toISOString();
  saveBoard(board);
  return board;
};

// List operations
export const createList = (boardId: string, title: string): List | null => {
  const board = getBoard();
  if (!board || board.id !== boardId) return null;
  const newList: List = {
    id: generateId(),
    title,
    boardId,
    position: board.lists.length,
    cards: [],
  };
  board.lists.push(newList);
  board.updatedAt = new Date().toISOString();
  saveBoard(board);
  return newList;
};

export const updateList = (boardId: string, listId: string, title: string): List | null => {
  const board = getBoard();
  if (!board || board.id !== boardId) return null;
  const list = board.lists.find(l => l.id === listId);
  if (!list) return null;
  list.title = title;
  board.updatedAt = new Date().toISOString();
  saveBoard(board);
  return list;
};

export const deleteList = (boardId: string, listId: string): boolean => {
  const board = getBoard();
  if (!board || board.id !== boardId) return false;
  const index = board.lists.findIndex(l => l.id === listId);
  if (index === -1) return false;
  board.lists.splice(index, 1);
  // Reorder remaining lists
  board.lists.forEach((list, i) => { list.position = i; });
  board.updatedAt = new Date().toISOString();
  saveBoard(board);
  return true;
};

export const reorderLists = (boardId: string, listIds: string[]): boolean => {
  const board = getBoard();
  if (!board || board.id !== boardId) return false;
  const reorderedLists: List[] = [];
  listIds.forEach((id, index) => {
    const list = board.lists.find(l => l.id === id);
    if (list) {
      list.position = index;
      reorderedLists.push(list);
    }
  });
  board.lists = reorderedLists;
  board.updatedAt = new Date().toISOString();
  saveBoard(board);
  return true;
};

// Card operations
export const createCard = (listId: string, title: string): Card | null => {
  const board = getBoard();
  if (!board) return null;
  const list = board.lists.find(l => l.id === listId);
  if (!list) return null;
  const now = new Date().toISOString();
  const newCard: Card = {
    id: generateId(),
    title,
    listId,
    position: list.cards.length,
    createdAt: now,
    updatedAt: now,
    labelIds: [],
    memberIds: [],
    checklists: [],
  };
  list.cards.push(newCard);
  board.updatedAt = now;
  saveBoard(board);
  return newCard;
};

export const updateCard = (cardId: string, updates: Partial<Card>): Card | null => {
  const board = getBoard();
  if (!board) return null;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      Object.assign(card, updates);
      card.updatedAt = new Date().toISOString();
      board.updatedAt = card.updatedAt;
      saveBoard(board);
      return card;
    }
  }
  return null;
};

export const deleteCard = (cardId: string): boolean => {
  const board = getBoard();
  if (!board) return false;
  for (const list of board.lists) {
    const index = list.cards.findIndex(c => c.id === cardId);
    if (index !== -1) {
      list.cards.splice(index, 1);
      // Reorder remaining cards
      list.cards.forEach((card, i) => { card.position = i; });
      board.updatedAt = new Date().toISOString();
      saveBoard(board);
      return true;
    }
  }
  return false;
};

export const moveCard = (cardId: string, targetListId: string, targetIndex: number): boolean => {
  const board = getBoard();
  if (!board) return false;
  
  let card: Card | undefined;
  let sourceList: List | undefined;
  
  // Find card and its source list
  for (const list of board.lists) {
    const foundCard = list.cards.find(c => c.id === cardId);
    if (foundCard) {
      card = foundCard;
      sourceList = list;
      break;
    }
  }
  
  if (!card || !sourceList) return false;
  
  const targetList = board.lists.find(l => l.id === targetListId);
  if (!targetList) return false;
  
  // Remove from source
  sourceList.cards = sourceList.cards.filter(c => c.id !== cardId);
  sourceList.cards.forEach((c, i) => { c.position = i; });
  
  // Add to target
  card.listId = targetListId;
  card.position = targetIndex;
  targetList.cards.splice(targetIndex, 0, card);
  targetList.cards.forEach((c, i) => { c.position = i; });
  
  board.updatedAt = new Date().toISOString();
  saveBoard(board);
  return true;
};

export const reorderCards = (listId: string, cardIds: string[]): boolean => {
  const board = getBoard();
  if (!board) return false;
  const list = board.lists.find(l => l.id === listId);
  if (!list) return false;
  
  const reorderedCards: Card[] = [];
  cardIds.forEach((id, index) => {
    const card = list.cards.find(c => c.id === id);
    if (card) {
      card.position = index;
      reorderedCards.push(card);
    }
  });
  list.cards = reorderedCards;
  board.updatedAt = new Date().toISOString();
  saveBoard(board);
  return true;
};

// Label operations
export const createLabel = (boardId: string, name: string, color: string): Label | null => {
  const board = getBoard();
  if (!board || board.id !== boardId) return null;
  const newLabel: Label = {
    id: generateId(),
    name,
    color,
    boardId,
  };
  board.labels.push(newLabel);
  board.updatedAt = new Date().toISOString();
  saveBoard(board);
  return newLabel;
};

export const assignLabelToCard = (cardId: string, labelId: string): boolean => {
  const board = getBoard();
  if (!board) return false;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      if (!card.labelIds.includes(labelId)) {
        card.labelIds.push(labelId);
        card.updatedAt = new Date().toISOString();
        board.updatedAt = card.updatedAt;
        saveBoard(board);
      }
      return true;
    }
  }
  return false;
};

export const removeLabelFromCard = (cardId: string, labelId: string): boolean => {
  const board = getBoard();
  if (!board) return false;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      card.labelIds = card.labelIds.filter(id => id !== labelId);
      card.updatedAt = new Date().toISOString();
      board.updatedAt = card.updatedAt;
      saveBoard(board);
      return true;
    }
  }
  return false;
};

// Member operations
export const assignMemberToCard = (cardId: string, memberId: string): boolean => {
  const board = getBoard();
  if (!board) return false;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      if (!card.memberIds.includes(memberId)) {
        card.memberIds.push(memberId);
        card.updatedAt = new Date().toISOString();
        board.updatedAt = card.updatedAt;
        saveBoard(board);
      }
      return true;
    }
  }
  return false;
};

export const removeMemberFromCard = (cardId: string, memberId: string): boolean => {
  const board = getBoard();
  if (!board) return false;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      card.memberIds = card.memberIds.filter(id => id !== memberId);
      card.updatedAt = new Date().toISOString();
      board.updatedAt = card.updatedAt;
      saveBoard(board);
      return true;
    }
  }
  return false;
};

// Checklist operations
export const createChecklist = (cardId: string, title: string): Checklist | null => {
  const board = getBoard();
  if (!board) return null;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      const newChecklist: Checklist = {
        id: generateId(),
        title,
        items: [],
      };
      card.checklists.push(newChecklist);
      card.updatedAt = new Date().toISOString();
      board.updatedAt = card.updatedAt;
      saveBoard(board);
      return newChecklist;
    }
  }
  return null;
};

export const addChecklistItem = (cardId: string, checklistId: string, text: string): ChecklistItem | null => {
  const board = getBoard();
  if (!board) return null;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      const checklist = card.checklists.find(cl => cl.id === checklistId);
      if (checklist) {
        const newItem: ChecklistItem = {
          id: generateId(),
          text,
          completed: false,
        };
        checklist.items.push(newItem);
        card.updatedAt = new Date().toISOString();
        board.updatedAt = card.updatedAt;
        saveBoard(board);
        return newItem;
      }
    }
  }
  return null;
};

export const toggleChecklistItem = (cardId: string, checklistId: string, itemId: string): boolean => {
  const board = getBoard();
  if (!board) return false;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      const checklist = card.checklists.find(cl => cl.id === checklistId);
      if (checklist) {
        const item = checklist.items.find(i => i.id === itemId);
        if (item) {
          item.completed = !item.completed;
          card.updatedAt = new Date().toISOString();
          board.updatedAt = card.updatedAt;
          saveBoard(board);
          return true;
        }
      }
    }
  }
  return false;
};

export const deleteChecklistItem = (cardId: string, checklistId: string, itemId: string): boolean => {
  const board = getBoard();
  if (!board) return false;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      const checklist = card.checklists.find(cl => cl.id === checklistId);
      if (checklist) {
        const index = checklist.items.findIndex(i => i.id === itemId);
        if (index !== -1) {
          checklist.items.splice(index, 1);
          card.updatedAt = new Date().toISOString();
          board.updatedAt = card.updatedAt;
          saveBoard(board);
          return true;
        }
      }
    }
  }
  return false;
};

export const deleteChecklist = (cardId: string, checklistId: string): boolean => {
  const board = getBoard();
  if (!board) return false;
  for (const list of board.lists) {
    const card = list.cards.find(c => c.id === cardId);
    if (card) {
      const index = card.checklists.findIndex(cl => cl.id === checklistId);
      if (index !== -1) {
        card.checklists.splice(index, 1);
        card.updatedAt = new Date().toISOString();
        board.updatedAt = card.updatedAt;
        saveBoard(board);
        return true;
      }
    }
  }
  return false;
};

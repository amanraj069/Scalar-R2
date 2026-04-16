export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  boardId: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  labelIds: string[];
  memberIds: string[];
  checklists: Checklist[];
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lists: List[];
  labels: Label[];
}

export type FilterType = 'all' | 'labels' | 'members' | 'dueDate';

export interface FilterOptions {
  search?: string;
  labelIds?: string[];
  memberIds?: string[];
  dueDate?: 'overdue' | 'today' | 'week' | 'none';
}

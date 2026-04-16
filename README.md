# Trello Clone - Kanban Project Management Tool

A minimal, Trello-like Kanban board application for project management. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

### Core Features
- **Board Management**: View and manage a Kanban board with customizable title
- **Lists**: Create, edit, delete, and reorder lists with drag-and-drop
- **Cards**: Create cards with title and description
- **Drag & Drop**: Smooth drag-and-drop for reordering lists and moving cards between lists

### Card Details
- **Labels**: Assign colored labels to cards (High Priority, Medium Priority, Low Priority, Bug, Feature, Design)
- **Due Dates**: Set and view due dates on cards
- **Checklists**: Create checklists with items that can be marked complete/incomplete
- **Members**: Assign team members to cards

### Search & Filter
- **Search**: Search cards by title
- **Filter by Labels**: Filter cards by assigned labels
- **Filter by Members**: Filter cards by assigned members
- **Filter by Due Date**: Filter by overdue, today, this week, or no due date

## Tech Stack

- **Frontend**: Next.js 16.2.4, React 19, TypeScript, Tailwind CSS v4
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Storage**: LocalStorage (client-side persistence)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

The static files will be generated in the `dist` folder.

## Usage

### Managing Lists
- Click "Add another list" to create a new list
- Click on a list title to edit it
- Click the menu icon (three dots) to delete a list
- Drag and drop lists to reorder them

### Managing Cards
- Click "Add a card" at the bottom of a list to create a new card
- Click on a card to open the details modal
- Drag and drop cards to reorder within a list or move to another list

### Card Details
- **Title & Description**: Edit directly in the modal
- **Labels**: Click "Labels" in the sidebar to assign/remove labels
- **Due Date**: Click "Due Date" to set a date
- **Checklist**: Click "Checklist" to create a new checklist, then add items
- **Members**: Click "Members" to assign/remove team members
- **Delete**: Click "Delete" to remove the card

### Search & Filter
- Use the search bar in the header to find cards by title
- Click the "Filter" button to filter by labels, members, or due date

## Data Storage

All data is stored in the browser's LocalStorage. This means:
- Data persists across page refreshes
- Each browser has its own separate data
- Clearing browser data will reset the board to sample data

## Sample Data

The application comes pre-loaded with:
- 1 Board: "Product Launch Project"
- 4 Lists: To Do, In Progress, Review, Done
- 6 Sample Cards with labels, members, due dates, and checklists
- 4 Sample Members
- 6 Colored Labels

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

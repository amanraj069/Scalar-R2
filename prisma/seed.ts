import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample members
  const members = await Promise.all([
    prisma.member.create({ data: { name: 'Alice Johnson', email: 'alice@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' } }),
    prisma.member.create({ data: { name: 'Bob Smith', email: 'bob@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' } }),
    prisma.member.create({ data: { name: 'Carol Williams', email: 'carol@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' } }),
    prisma.member.create({ data: { name: 'David Brown', email: 'david@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' } }),
  ])

  // Create a sample board
  const board = await prisma.board.create({
    data: {
      title: 'Product Launch Project',
    },
  })

  // Create labels for the board
  const labels = await Promise.all([
    prisma.label.create({ data: { name: 'High Priority', color: '#ef4444', boardId: board.id } }),
    prisma.label.create({ data: { name: 'Medium Priority', color: '#f59e0b', boardId: board.id } }),
    prisma.label.create({ data: { name: 'Low Priority', color: '#22c55e', boardId: board.id } }),
    prisma.label.create({ data: { name: 'Bug', color: '#dc2626', boardId: board.id } }),
    prisma.label.create({ data: { name: 'Feature', color: '#3b82f6', boardId: board.id } }),
    prisma.label.create({ data: { name: 'Design', color: '#a855f7', boardId: board.id } }),
  ])

  // Create lists
  const todoList = await prisma.list.create({
    data: { title: 'To Do', boardId: board.id, position: 0 },
  })
  const inProgressList = await prisma.list.create({
    data: { title: 'In Progress', boardId: board.id, position: 1 },
  })
  const reviewList = await prisma.list.create({
    data: { title: 'Review', boardId: board.id, position: 2 },
  })
  const doneList = await prisma.list.create({
    data: { title: 'Done', boardId: board.id, position: 3 },
  })

  // Create sample cards for To Do
  const card1 = await prisma.card.create({
    data: {
      title: 'Research competitor products',
      description: 'Analyze top 5 competitors and their features',
      listId: todoList.id,
      position: 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.cardMember.create({ data: { cardId: card1.id, memberId: members[0].id } })
  await prisma.cardLabel.create({ data: { cardId: card1.id, labelId: labels[4].id } })

  const card2 = await prisma.card.create({
    data: {
      title: 'Create wireframes',
      description: 'Design initial wireframes for all screens',
      listId: todoList.id,
      position: 1,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.cardMember.create({ data: { cardId: card2.id, memberId: members[1].id } })
  await prisma.cardLabel.create({ data: { cardId: card2.id, labelId: labels[5].id } })

  // Create a card with checklist
  const card3 = await prisma.card.create({
    data: {
      title: 'Set up development environment',
      description: 'Configure local dev environment and tools',
      listId: inProgressList.id,
      position: 0,
    },
  })

  await prisma.cardMember.create({ data: { cardId: card3.id, memberId: members[2].id } })
  await prisma.cardLabel.create({ data: { cardId: card3.id, labelId: labels[0].id } })

  const checklist = await prisma.checklist.create({
    data: { title: 'Setup Tasks', cardId: card3.id },
  })

  await Promise.all([
    prisma.checklistItem.create({ data: { checklistId: checklist.id, text: 'Install Node.js', completed: true } }),
    prisma.checklistItem.create({ data: { checklistId: checklist.id, text: 'Install VS Code extensions', completed: true } }),
    prisma.checklistItem.create({ data: { checklistId: checklist.id, text: 'Configure Git', completed: false } }),
    prisma.checklistItem.create({ data: { checklistId: checklist.id, text: 'Set up database', completed: false } }),
  ])

  // Create cards for In Progress
  const card4 = await prisma.card.create({
    data: {
      title: 'Design system components',
      description: 'Create reusable UI component library',
      listId: inProgressList.id,
      position: 1,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.cardMember.createMany({
    data: [
      { cardId: card4.id, memberId: members[0].id },
      { cardId: card4.id, memberId: members[2].id },
    ],
  })
  await prisma.cardLabel.create({ data: { cardId: card4.id, labelId: labels[5].id } })

  // Create cards for Review
  const card5 = await prisma.card.create({
    data: {
      title: 'Fix navigation bug',
      description: 'Mobile menu not closing on link click',
      listId: reviewList.id,
      position: 0,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.cardMember.create({ data: { cardId: card5.id, memberId: members[3].id } })
  await prisma.cardLabel.createMany({
    data: [
      { cardId: card5.id, labelId: labels[3].id },
      { cardId: card5.id, labelId: labels[0].id },
    ],
  })

  // Create cards for Done
  const card6 = await prisma.card.create({
    data: {
      title: 'Project kickoff meeting',
      description: 'Initial team meeting and planning session',
      listId: doneList.id,
      position: 0,
    },
  })

  await prisma.cardMember.createMany({
    data: members.map(m => ({ cardId: card6.id, memberId: m.id })),
  })
  await prisma.cardLabel.create({ data: { cardId: card6.id, labelId: labels[2].id } })

  console.log('Seed data created successfully!')
  console.log(`Board: ${board.title}`)
  console.log(`Members: ${members.length}`)
  console.log(`Lists: 4`)
  console.log(`Cards: 6`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

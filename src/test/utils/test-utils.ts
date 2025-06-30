import { mount, VueWrapper } from '@vue/test-utils'
import { ComponentPublicInstance } from 'vue'
import type { Note, Category } from '@/types'

export const createMockNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'test-note-1',
  title: 'Test Note',
  content: 'This is a test note content',
  category: 'personal',
  tags: ['test', 'sample'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  pinned: false,
  ...overrides
})

export const createMockCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 'personal',
  name: 'Personal',
  color: '#6366f1',
  ...overrides
})

export const createMockCategories = (): Category[] => [
  createMockCategory({ id: 'personal', name: 'Personal', color: '#6366f1' }),
  createMockCategory({ id: 'work', name: 'Work', color: '#10b981' }),
  createMockCategory({ id: 'ideas', name: 'Ideas', color: '#f59e0b' })
]

export const createMockNotes = (): Note[] => [
  createMockNote({
    id: 'note-1',
    title: 'First Note',
    content: 'Content of first note',
    category: 'personal',
    tags: ['personal', 'important'],
    pinned: true
  }),
  createMockNote({
    id: 'note-2',
    title: 'Work Meeting',
    content: 'Meeting notes from today',
    category: 'work',
    tags: ['work', 'meeting'],
    pinned: false
  }),
  createMockNote({
    id: 'note-3',
    title: 'App Ideas',
    content: 'Ideas for new applications',
    category: 'ideas',
    tags: ['ideas', 'development'],
    pinned: false
  })
]

export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))

export type ComponentWrapper<T = ComponentPublicInstance> = VueWrapper<T>
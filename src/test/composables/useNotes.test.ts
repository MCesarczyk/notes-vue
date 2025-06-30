import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotes } from '@/composables/useNotes'
import { createMockNotes, createMockCategories } from '../utils/test-utils'

describe('useNotes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('initialization', () => {
    it('should initialize with default categories', () => {
      const { categories } = useNotes()
      
      expect(categories.value).toHaveLength(3)
      expect(categories.value[0].name).toBe('Personal')
      expect(categories.value[1].name).toBe('Work')
      expect(categories.value[2].name).toBe('Ideas')
    })

    it('should initialize with empty notes array', () => {
      const { notes } = useNotes()
      expect(notes.value).toEqual([])
    })

    it('should load notes from localStorage', () => {
      const mockNotes = createMockNotes()
      localStorage.setItem('vue-notes-app', JSON.stringify(mockNotes))
      
      const { notes } = useNotes()
      expect(notes.value).toHaveLength(3)
    })
  })

  describe('createNote', () => {
    it('should create a new note with provided data', () => {
      const { createNote, notes } = useNotes()
      
      const noteData = {
        title: 'New Note',
        content: 'New content',
        category: 'personal',
        tags: ['test']
      }
      
      const createdNote = createNote(noteData)
      
      expect(createdNote.id).toBe('test-id-123')
      expect(createdNote.title).toBe('New Note')
      expect(createdNote.content).toBe('New content')
      expect(createdNote.category).toBe('personal')
      expect(createdNote.tags).toEqual(['test'])
      expect(createdNote.pinned).toBe(false)
      expect(notes.value).toHaveLength(1)
    })

    it('should create note with default values when data is missing', () => {
      const { createNote, categories } = useNotes()
      
      const createdNote = createNote({})
      
      expect(createdNote.title).toBe('Untitled Note')
      expect(createdNote.content).toBe('')
      expect(createdNote.category).toBe(categories.value[0].id)
      expect(createdNote.tags).toEqual([])
    })
  })

  describe('updateNote', () => {
    it('should update existing note', () => {
      const { createNote, updateNote } = useNotes()
      
      const note = createNote({ title: 'Original Title' })
      const updatedNote = updateNote(note.id, { title: 'Updated Title' })
      
      expect(updatedNote?.title).toBe('Updated Title')
      expect(updatedNote?.updatedAt).toBeInstanceOf(Date)
    })

    it('should return null for non-existent note', () => {
      const { updateNote } = useNotes()
      
      const result = updateNote('non-existent', { title: 'Updated' })
      
      expect(result).toBeNull()
    })
  })

  describe('deleteNote', () => {
    it('should delete existing note', () => {
      const { createNote, deleteNote, notes } = useNotes()
      
      const note = createNote({ title: 'To Delete' })
      expect(notes.value).toHaveLength(1)
      
      const result = deleteNote(note.id)
      
      expect(result).toBe(true)
      expect(notes.value).toHaveLength(0)
    })

    it('should return false for non-existent note', () => {
      const { deleteNote } = useNotes()
      
      const result = deleteNote('non-existent')
      
      expect(result).toBe(false)
    })
  })

  describe('togglePin', () => {
    it('should toggle pin status', () => {
      const { createNote, togglePin, notes } = useNotes()
      
      const note = createNote({ title: 'Test Note' })
      expect(note.pinned).toBe(false)
      
      togglePin(note.id)
      
      expect(notes.value[0].pinned).toBe(true)
      
      togglePin(note.id)
      
      expect(notes.value[0].pinned).toBe(false)
    })
  })

  describe('duplicateNote', () => {
    it('should create a copy of existing note', () => {
      const { createNote, duplicateNote, notes } = useNotes()
      
      const original = createNote({
        title: 'Original Note',
        content: 'Original content',
        tags: ['original']
      })
      
      const duplicate = duplicateNote(original.id)
      
      expect(duplicate?.title).toBe('Original Note (Copy)')
      expect(duplicate?.content).toBe('Original content')
      expect(duplicate?.tags).toEqual(['original'])
      expect(duplicate?.pinned).toBe(false)
      expect(notes.value).toHaveLength(2)
    })
  })

  describe('filtering', () => {
    it('should filter notes by search term', () => {
      const { createNote, updateFilter, filteredNotes } = useNotes()
      
      createNote({ title: 'JavaScript Tutorial', content: 'Learn JS' })
      createNote({ title: 'Python Guide', content: 'Learn Python' })
      
      updateFilter({ search: 'javascript' })
      
      expect(filteredNotes.value).toHaveLength(1)
      expect(filteredNotes.value[0].title).toBe('JavaScript Tutorial')
    })

    it('should filter notes by category', () => {
      const { createNote, updateFilter, filteredNotes } = useNotes()
      
      createNote({ title: 'Work Note', category: 'work' })
      createNote({ title: 'Personal Note', category: 'personal' })
      
      updateFilter({ category: 'work' })
      
      expect(filteredNotes.value).toHaveLength(1)
      expect(filteredNotes.value[0].title).toBe('Work Note')
    })

    it('should filter notes by tags', () => {
      const { createNote, updateFilter, filteredNotes } = useNotes()
      
      createNote({ title: 'Note 1', tags: ['important', 'work'] })
      createNote({ title: 'Note 2', tags: ['personal'] })
      
      updateFilter({ tags: ['important'] })
      
      expect(filteredNotes.value).toHaveLength(1)
      expect(filteredNotes.value[0].title).toBe('Note 1')
    })

    it('should sort notes correctly', () => {
      const { createNote, updateFilter, filteredNotes } = useNotes()
      
      createNote({ title: 'B Note' })
      createNote({ title: 'A Note' })
      
      updateFilter({ sortBy: 'title', sortOrder: 'asc' })
      
      expect(filteredNotes.value[0].title).toBe('A Note')
      expect(filteredNotes.value[1].title).toBe('B Note')
    })

    it('should prioritize pinned notes', () => {
      const { createNote, togglePin, filteredNotes } = useNotes()
      
      const note1 = createNote({ title: 'Regular Note' })
      const note2 = createNote({ title: 'Pinned Note' })
      
      togglePin(note2.id)
      
      expect(filteredNotes.value[0].title).toBe('Pinned Note')
      expect(filteredNotes.value[1].title).toBe('Regular Note')
    })
  })

  describe('allTags computed', () => {
    it('should return unique tags from all notes', () => {
      const { createNote, allTags } = useNotes()
      
      createNote({ tags: ['tag1', 'tag2'] })
      createNote({ tags: ['tag2', 'tag3'] })
      
      expect(allTags.value).toEqual(['tag1', 'tag2', 'tag3'])
    })
  })
})
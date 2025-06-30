import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import { useNotes } from '@/composables/useNotes'
import { waitForNextTick, createMockNote, createMockCategories } from '../utils/test-utils'

// Create a more realistic mock for integration testing
const createNotesComposableMock = () => {
  const notes = { value: [] as any[] }
  const categories = { value: createMockCategories() }
  const filter = { 
    value: {
      search: '',
      category: '',
      tags: [],
      sortBy: 'updatedAt' as const,
      sortOrder: 'desc' as const
    }
  }
  
  const createNote = vi.fn((noteData) => {
    const note = createMockNote(noteData)
    notes.value.unshift(note)
    return note
  })
  
  const updateNote = vi.fn((id, updates) => {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], ...updates }
      return notes.value[index]
    }
    return null
  })
  
  const deleteNote = vi.fn((id) => {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      return true
    }
    return false
  })

  return {
    notes,
    categories,
    filter,
    filteredNotes: notes,
    allTags: { value: [] },
    createNote,
    updateNote,
    deleteNote: deleteNote,
    togglePin: vi.fn(),
    duplicateNote: vi.fn(),
    updateFilter: vi.fn(),
    clearFilter: vi.fn()
  }
}

vi.mock('@/composables/useNotes', () => ({
  useNotes: vi.fn()
}))

describe('Note Workflow Integration', () => {
  let mockComposable: ReturnType<typeof createNotesComposableMock>

  beforeEach(() => {
    mockComposable = createNotesComposableMock()
    vi.mocked(useNotes).mockReturnValue(mockComposable)
  })

  it('should complete full note creation workflow', async () => {
    const wrapper = mount(App)

    // Initially should show empty state
    expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(true)

    // Click new note button
    const newNoteButton = wrapper.find('button:contains("New Note")')
    await newNoteButton.trigger('click')
    await waitForNextTick()

    // Note editor should be visible
    const noteEditor = wrapper.findComponent({ name: 'NoteEditor' })
    expect(noteEditor.exists()).toBe(true)

    // Fill in note details
    await noteEditor.find('#title').setValue('Test Note Title')
    await noteEditor.find('#content').setValue('Test note content')

    // Save the note
    noteEditor.vm.$emit('save', {
      title: 'Test Note Title',
      content: 'Test note content',
      category: 'personal',
      tags: []
    })
    await waitForNextTick()

    // Verify note was created
    expect(mockComposable.createNote).toHaveBeenCalledWith({
      title: 'Test Note Title',
      content: 'Test note content',
      category: 'personal',
      tags: []
    })

    // Editor should be closed
    expect(wrapper.findComponent({ name: 'NoteEditor' }).exists()).toBe(false)
  })

  it('should handle note editing workflow', async () => {
    // Add a note first
    const existingNote = createMockNote({
      id: 'test-note-1',
      title: 'Original Title',
      content: 'Original content'
    })
    mockComposable.notes.value.push(existingNote)

    const wrapper = mount(App)

    // Should show note card instead of empty state
    expect(wrapper.findComponent({ name: 'EmptyState' }).exists()).toBe(false)
    
    // Find and click on note card
    const noteCard = wrapper.findComponent({ name: 'NoteCard' })
    expect(noteCard.exists()).toBe(true)
    
    // Simulate edit click
    noteCard.vm.$emit('edit', existingNote)
    await waitForNextTick()

    // Note editor should be visible with existing data
    const noteEditor = wrapper.findComponent({ name: 'NoteEditor' })
    expect(noteEditor.exists()).toBe(true)
    expect(noteEditor.props('note')).toEqual(existingNote)

    // Update the note
    noteEditor.vm.$emit('save', {
      id: 'test-note-1',
      title: 'Updated Title',
      content: 'Updated content'
    })
    await waitForNextTick()

    // Verify note was updated
    expect(mockComposable.updateNote).toHaveBeenCalledWith('test-note-1', {
      id: 'test-note-1',
      title: 'Updated Title',
      content: 'Updated content'
    })
  })

  it('should handle note deletion workflow', async () => {
    // Add a note first
    const existingNote = createMockNote({
      id: 'test-note-1',
      title: 'Note to Delete'
    })
    mockComposable.notes.value.push(existingNote)

    const wrapper = mount(App)

    // Find note card and trigger delete
    const noteCard = wrapper.findComponent({ name: 'NoteCard' })
    noteCard.vm.$emit('delete', 'test-note-1')
    await waitForNextTick()

    // Delete confirmation modal should appear
    const deleteModal = wrapper.find('.fixed.inset-0')
    expect(deleteModal.exists()).toBe(true)
    expect(wrapper.text()).toContain('Delete Note')
    expect(wrapper.text()).toContain('Note to Delete')

    // Confirm deletion
    const confirmButton = wrapper.find('button:contains("Delete")')
    await confirmButton.trigger('click')
    await waitForNextTick()

    // Verify note was deleted
    expect(mockComposable.deleteNote).toHaveBeenCalledWith('test-note-1')
  })

  it('should handle search and filter workflow', async () => {
    const wrapper = mount(App)

    // Find search filter component
    const searchFilter = wrapper.findComponent({ name: 'SearchFilter' })
    expect(searchFilter.exists()).toBe(true)

    // Simulate search
    searchFilter.vm.$emit('update:filter', {
      search: 'test search',
      category: '',
      tags: [],
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    })
    await waitForNextTick()

    // Verify filter was updated
    expect(mockComposable.updateFilter).toHaveBeenCalledWith({
      search: 'test search',
      category: '',
      tags: [],
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    })
  })
})
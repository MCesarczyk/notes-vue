import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import { waitForNextTick } from '../utils/test-utils'

// Mock the useNotes composable
vi.mock('@/composables/useNotes', () => ({
  useNotes: () => ({
    notes: { value: [] },
    categories: { 
      value: [
        { id: '1', name: 'Personal', color: '#6366f1' },
        { id: '2', name: 'Work', color: '#10b981' },
        { id: '3', name: 'Ideas', color: '#f59e0b' }
      ]
    },
    filter: { 
      value: {
        search: '',
        category: '',
        tags: [],
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      }
    },
    filteredNotes: { value: [] },
    allTags: { value: [] },
    createNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
    togglePin: vi.fn(),
    duplicateNote: vi.fn(),
    updateFilter: vi.fn(),
    clearFilter: vi.fn()
  })
}))

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render main layout correctly', () => {
    const wrapper = mount(App)

    // Check header
    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Vue Notes')
    
    // Check main content
    expect(wrapper.find('main').exists()).toBe(true)
    
    // Check new note button
    const newNoteButton = wrapper.find('button:contains("New Note")')
    expect(newNoteButton.exists()).toBe(true)
  })

  it('should show empty state when no notes exist', () => {
    const wrapper = mount(App)

    const emptyState = wrapper.findComponent({ name: 'EmptyState' })
    expect(emptyState.exists()).toBe(true)
  })

  it('should open note editor when new note button is clicked', async () => {
    const wrapper = mount(App)

    const newNoteButton = wrapper.find('button:contains("New Note")')
    await newNoteButton.trigger('click')

    await waitForNextTick()

    const noteEditor = wrapper.findComponent({ name: 'NoteEditor' })
    expect(noteEditor.exists()).toBe(true)
  })

  it('should close note editor when close event is emitted', async () => {
    const wrapper = mount(App)

    // Open editor
    const newNoteButton = wrapper.find('button:contains("New Note")')
    await newNoteButton.trigger('click')
    await waitForNextTick()

    // Close editor
    const noteEditor = wrapper.findComponent({ name: 'NoteEditor' })
    noteEditor.vm.$emit('close')
    await waitForNextTick()

    expect(wrapper.findComponent({ name: 'NoteEditor' }).exists()).toBe(false)
  })

  it('should display note count in header', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('0 notes')
  })

  it('should render search filter component', () => {
    const wrapper = mount(App)

    const searchFilter = wrapper.findComponent({ name: 'SearchFilter' })
    expect(searchFilter.exists()).toBe(true)
  })
})
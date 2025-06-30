import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NoteCard from '@/components/NoteCard.vue'
import { createMockNote, createMockCategories } from '../utils/test-utils'

describe('NoteCard', () => {
  const defaultProps = {
    note: createMockNote(),
    categories: createMockCategories()
  }

  it('should render note information correctly', () => {
    const wrapper = mount(NoteCard, {
      props: defaultProps
    })

    expect(wrapper.find('h3').text()).toBe('Test Note')
    expect(wrapper.find('p').text()).toBe('This is a test note content')
  })

  it('should display pin indicator for pinned notes', () => {
    const pinnedNote = createMockNote({ pinned: true })
    const wrapper = mount(NoteCard, {
      props: {
        ...defaultProps,
        note: pinnedNote
      }
    })

    const pinIndicator = wrapper.find('[title="Pinned note"]')
    expect(pinIndicator.exists()).toBe(true)
  })

  it('should not display pin indicator for unpinned notes', () => {
    const wrapper = mount(NoteCard, {
      props: defaultProps
    })

    const pinIndicator = wrapper.find('[title="Pinned note"]')
    expect(pinIndicator.exists()).toBe(false)
  })

  it('should render tags when present', () => {
    const noteWithTags = createMockNote({ tags: ['tag1', 'tag2'] })
    const wrapper = mount(NoteCard, {
      props: {
        ...defaultProps,
        note: noteWithTags
      }
    })

    const tags = wrapper.findAll('.tag')
    expect(tags).toHaveLength(2)
    expect(tags[0].text()).toBe('tag1')
    expect(tags[1].text()).toBe('tag2')
  })

  it('should emit edit event when card is clicked', async () => {
    const wrapper = mount(NoteCard, {
      props: defaultProps
    })

    await wrapper.find('.cursor-pointer').trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([defaultProps.note])
  })

  it('should emit toggle-pin event when pin button is clicked', async () => {
    const wrapper = mount(NoteCard, {
      props: defaultProps
    })

    const pinButton = wrapper.find('[title="Pin note"]')
    await pinButton.trigger('click')

    expect(wrapper.emitted('toggle-pin')).toBeTruthy()
    expect(wrapper.emitted('toggle-pin')?.[0]).toEqual([defaultProps.note.id])
  })

  it('should emit duplicate event when duplicate button is clicked', async () => {
    const wrapper = mount(NoteCard, {
      props: defaultProps
    })

    const duplicateButton = wrapper.find('[title="Duplicate note"]')
    await duplicateButton.trigger('click')

    expect(wrapper.emitted('duplicate')).toBeTruthy()
    expect(wrapper.emitted('duplicate')?.[0]).toEqual([defaultProps.note.id])
  })

  it('should emit delete event when delete button is clicked', async () => {
    const wrapper = mount(NoteCard, {
      props: defaultProps
    })

    const deleteButton = wrapper.find('[title="Delete note"]')
    await deleteButton.trigger('click')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([defaultProps.note.id])
  })

  it('should display correct category name', () => {
    const wrapper = mount(NoteCard, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Personal')
  })

  it('should format date correctly', () => {
    const note = createMockNote({
      updatedAt: new Date('2024-01-15')
    })
    const wrapper = mount(NoteCard, {
      props: {
        ...defaultProps,
        note
      }
    })

    expect(wrapper.text()).toContain('Jan 15')
  })

  it('should show actions on hover', async () => {
    const wrapper = mount(NoteCard, {
      props: defaultProps
    })

    const actionsContainer = wrapper.find('.opacity-0')
    expect(actionsContainer.exists()).toBe(true)
    expect(actionsContainer.classes()).toContain('group-hover:opacity-100')
  })
})
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NoteEditor from '@/components/NoteEditor.vue'
import { createMockNote, createMockCategories } from '../utils/test-utils'

describe('NoteEditor', () => {
  const defaultProps = {
    categories: createMockCategories()
  }

  it('should render create mode correctly', () => {
    const wrapper = mount(NoteEditor, {
      props: defaultProps
    })

    expect(wrapper.find('h2').text()).toBe('Create New Note')
    expect(wrapper.find('button[type="submit"]').text()).toContain('Create Note')
  })

  it('should render edit mode correctly', () => {
    const note = createMockNote()
    const wrapper = mount(NoteEditor, {
      props: {
        ...defaultProps,
        note
      }
    })

    expect(wrapper.find('h2').text()).toBe('Edit Note')
    expect(wrapper.find('button[type="submit"]').text()).toContain('Update Note')
  })

  it('should populate form with note data in edit mode', () => {
    const note = createMockNote({
      title: 'Test Title',
      content: 'Test Content',
      category: 'work',
      tags: ['tag1', 'tag2']
    })
    const wrapper = mount(NoteEditor, {
      props: {
        ...defaultProps,
        note
      }
    })

    const titleInput = wrapper.find('#title')
    const contentTextarea = wrapper.find('#content')
    const categorySelect = wrapper.find('#category')

    expect((titleInput.element as HTMLInputElement).value).toBe('Test Title')
    expect((contentTextarea.element as HTMLTextAreaElement).value).toBe('Test Content')
    expect((categorySelect.element as HTMLSelectElement).value).toBe('work')
    
    const tags = wrapper.findAll('.bg-primary-100')
    expect(tags).toHaveLength(2)
  })

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(NoteEditor, {
      props: defaultProps
    })

    await wrapper.find('button[aria-label="Close"]').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should emit close event when cancel button is clicked', async () => {
    const wrapper = mount(NoteEditor, {
      props: defaultProps
    })

    await wrapper.find('.btn-secondary').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should add tag when enter is pressed', async () => {
    const wrapper = mount(NoteEditor, {
      props: defaultProps
    })

    const tagInput = wrapper.find('input[placeholder*="Add tags"]')
    await tagInput.setValue('newtag')
    await tagInput.trigger('keydown.enter')

    const tags = wrapper.findAll('.bg-primary-100')
    expect(tags).toHaveLength(1)
    expect(tags[0].text()).toContain('newtag')
  })

  it('should add tag when comma is pressed', async () => {
    const wrapper = mount(NoteEditor, {
      props: defaultProps
    })

    const tagInput = wrapper.find('input[placeholder*="Add tags"]')
    await tagInput.setValue('newtag')
    await tagInput.trigger('keydown', { key: ',' })

    const tags = wrapper.findAll('.bg-primary-100')
    expect(tags).toHaveLength(1)
    expect(tags[0].text()).toContain('newtag')
  })

  it('should remove tag when remove button is clicked', async () => {
    const note = createMockNote({ tags: ['tag1', 'tag2'] })
    const wrapper = mount(NoteEditor, {
      props: {
        ...defaultProps,
        note
      }
    })

    const removeButtons = wrapper.findAll('.bg-primary-100 button')
    await removeButtons[0].trigger('click')

    const tags = wrapper.findAll('.bg-primary-100')
    expect(tags).toHaveLength(1)
  })

  it('should not add duplicate tags', async () => {
    const note = createMockNote({ tags: ['existing'] })
    const wrapper = mount(NoteEditor, {
      props: {
        ...defaultProps,
        note
      }
    })

    const tagInput = wrapper.find('input[placeholder*="Add tags"]')
    await tagInput.setValue('existing')
    await tagInput.trigger('keydown.enter')

    const tags = wrapper.findAll('.bg-primary-100')
    expect(tags).toHaveLength(1)
  })

  it('should emit save event with correct data on form submission', async () => {
    const wrapper = mount(NoteEditor, {
      props: defaultProps
    })

    await wrapper.find('#title').setValue('New Title')
    await wrapper.find('#content').setValue('New Content')
    await wrapper.find('#category').setValue('work')

    // Add a tag
    const tagInput = wrapper.find('input[placeholder*="Add tags"]')
    await tagInput.setValue('testtag')
    await tagInput.trigger('keydown.enter')

    await wrapper.find('.btn-primary').trigger('click')

    expect(wrapper.emitted('save')).toBeTruthy()
    const saveData = wrapper.emitted('save')?.[0][0]
    expect(saveData).toEqual({
      id: undefined,
      title: 'New Title',
      content: 'New Content',
      category: 'work',
      tags: ['testtag']
    })
  })

  it('should show alert when trying to save without title', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const wrapper = mount(NoteEditor, {
      props: defaultProps
    })

    await wrapper.find('.btn-primary').trigger('click')

    expect(alertSpy).toHaveBeenCalledWith('Please enter a title for your note.')
    expect(wrapper.emitted('save')).toBeFalsy()

    alertSpy.mockRestore()
  })

  it('should set default category when none is selected', async () => {
    const wrapper = mount(NoteEditor, {
      props: defaultProps
    })

    const categorySelect = wrapper.find('#category')
    expect((categorySelect.element as HTMLSelectElement).value).toBe(defaultProps.categories[0].id)
  })
})
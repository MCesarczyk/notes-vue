import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '@/components/EmptyState.vue'

describe('EmptyState', () => {
  it('should render with default props', () => {
    const wrapper = mount(EmptyState)

    expect(wrapper.find('h3').text()).toBe('No notes found')
    expect(wrapper.text()).toContain('Get started by creating your first note')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should render with custom title and description', () => {
    const wrapper = mount(EmptyState, {
      props: {
        title: 'Custom Title',
        description: 'Custom description text'
      }
    })

    expect(wrapper.find('h3').text()).toBe('Custom Title')
    expect(wrapper.text()).toContain('Custom description text')
  })

  it('should hide button when hideButton is true', () => {
    const wrapper = mount(EmptyState, {
      props: {
        hideButton: true
      }
    })

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('should emit create-note event when button is clicked', async () => {
    const wrapper = mount(EmptyState)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('create-note')).toBeTruthy()
  })

  it('should render icon correctly', () => {
    const wrapper = mount(EmptyState)

    const icon = wrapper.find('svg')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('w-12')
    expect(icon.classes()).toContain('h-12')
  })
})
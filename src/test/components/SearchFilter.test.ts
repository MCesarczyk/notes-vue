import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchFilter from '@/components/SearchFilter.vue'
import { createMockCategories } from '../utils/test-utils'
import type { Filter } from '@/types'

describe('SearchFilter', () => {
  const defaultFilter: Filter = {
    search: '',
    category: '',
    tags: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  }

  const defaultProps = {
    filter: defaultFilter,
    categories: createMockCategories(),
    allTags: ['tag1', 'tag2', 'tag3'],
    filteredCount: 5
  }

  it('should render search input', () => {
    const wrapper = mount(SearchFilter, {
      props: defaultProps
    })

    const searchInput = wrapper.find('input[placeholder*="Search notes"]')
    expect(searchInput.exists()).toBe(true)
  })

  it('should render category filter options', () => {
    const wrapper = mount(SearchFilter, {
      props: defaultProps
    })

    const categorySelect = wrapper.find('select').element as HTMLSelectElement
    const options = Array.from(categorySelect.options).map(opt => opt.text)
    
    expect(options).toContain('All Categories')
    expect(options).toContain('Personal')
    expect(options).toContain('Work')
    expect(options).toContain('Ideas')
  })

  it('should render sort options', () => {
    const wrapper = mount(SearchFilter, {
      props: defaultProps
    })

    const selects = wrapper.findAll('select')
    const sortBySelect = selects[1].element as HTMLSelectElement
    const sortOrderSelect = selects[2].element as HTMLSelectElement

    const sortByOptions = Array.from(sortBySelect.options).map(opt => opt.text)
    const sortOrderOptions = Array.from(sortOrderSelect.options).map(opt => opt.text)

    expect(sortByOptions).toContain('Last Modified')
    expect(sortByOptions).toContain('Date Created')
    expect(sortByOptions).toContain('Title')

    expect(sortOrderOptions).toContain('Descending')
    expect(sortOrderOptions).toContain('Ascending')
  })

  it('should render tag filter buttons', () => {
    const wrapper = mount(SearchFilter, {
      props: defaultProps
    })

    const tagButtons = wrapper.findAll('button').filter(btn => 
      ['tag1', 'tag2', 'tag3'].includes(btn.text())
    )
    
    expect(tagButtons).toHaveLength(3)
  })

  it('should emit update:filter when search input changes', async () => {
    const wrapper = mount(SearchFilter, {
      props: defaultProps
    })

    const searchInput = wrapper.find('input[placeholder*="Search notes"]')
    await searchInput.setValue('test search')

    expect(wrapper.emitted('update:filter')).toBeTruthy()
    const emittedFilter = wrapper.emitted('update:filter')?.[0][0] as Filter
    expect(emittedFilter.search).toBe('test search')
  })

  it('should emit update:filter when category changes', async () => {
    const wrapper = mount(SearchFilter, {
      props: defaultProps
    })

    const categorySelect = wrapper.find('select')
    await categorySelect.setValue('personal')

    expect(wrapper.emitted('update:filter')).toBeTruthy()
    const emittedFilter = wrapper.emitted('update:filter')?.[0][0] as Filter
    expect(emittedFilter.category).toBe('personal')
  })

  it('should toggle tag selection when tag button is clicked', async () => {
    const wrapper = mount(SearchFilter, {
      props: defaultProps
    })

    const tagButton = wrapper.find('button:contains("tag1")')
    await tagButton.trigger('click')

    expect(wrapper.emitted('update:filter')).toBeTruthy()
    const emittedFilter = wrapper.emitted('update:filter')?.[0][0] as Filter
    expect(emittedFilter.tags).toContain('tag1')
  })

  it('should show active tag styling for selected tags', () => {
    const filterWithTags: Filter = {
      ...defaultFilter,
      tags: ['tag1']
    }
    
    const wrapper = mount(SearchFilter, {
      props: {
        ...defaultProps,
        filter: filterWithTags
      }
    })

    const tagButtons = wrapper.findAll('button').filter(btn => 
      ['tag1', 'tag2', 'tag3'].includes(btn.text())
    )
    
    const activeButton = tagButtons.find(btn => btn.text() === 'tag1')
    const inactiveButton = tagButtons.find(btn => btn.text() === 'tag2')

    expect(activeButton?.classes()).toContain('bg-primary-500')
    expect(inactiveButton?.classes()).toContain('bg-gray-100')
  })

  it('should display filtered count', () => {
    const wrapper = mount(SearchFilter, {
      props: {
        ...defaultProps,
        filteredCount: 3
      }
    })

    expect(wrapper.text()).toContain('3 notes found')
  })

  it('should display singular form for count of 1', () => {
    const wrapper = mount(SearchFilter, {
      props: {
        ...defaultProps,
        filteredCount: 1
      }
    })

    expect(wrapper.text()).toContain('1 note found')
  })

  it('should show clear filters button when filters are active', () => {
    const activeFilter: Filter = {
      ...defaultFilter,
      search: 'test'
    }
    
    const wrapper = mount(SearchFilter, {
      props: {
        ...defaultProps,
        filter: activeFilter
      }
    })

    const clearButton = wrapper.find('button:contains("Clear Filters")')
    expect(clearButton.exists()).toBe(true)
  })

  it('should not show clear filters button when no filters are active', () => {
    const wrapper = mount(SearchFilter, {
      props: defaultProps
    })

    const clearButton = wrapper.find('button:contains("Clear Filters")')
    expect(clearButton.exists()).toBe(false)
  })

  it('should emit clear-filter when clear button is clicked', async () => {
    const activeFilter: Filter = {
      ...defaultFilter,
      search: 'test'
    }
    
    const wrapper = mount(SearchFilter, {
      props: {
        ...defaultProps,
        filter: activeFilter
      }
    })

    const clearButton = wrapper.find('button:contains("Clear Filters")')
    await clearButton.trigger('click')

    expect(wrapper.emitted('clear-filter')).toBeTruthy()
  })
})
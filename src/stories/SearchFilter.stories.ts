import type { Meta, StoryObj } from '@storybook/vue3';
import SearchFilter from '../components/SearchFilter.vue';
import type { Filter, Category } from '../types';

const mockCategories: Category[] = [
  { id: 'personal', name: 'Personal', color: '#6366f1' },
  { id: 'work', name: 'Work', color: '#10b981' },
  { id: 'ideas', name: 'Ideas', color: '#f59e0b' },
];

const defaultFilter: Filter = {
  search: '',
  category: '',
  tags: [],
  sortBy: 'updatedAt',
  sortOrder: 'desc',
};

const meta: Meta<typeof SearchFilter> = {
  title: 'Components/SearchFilter',
  component: SearchFilter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive search and filter component for notes with search, category filtering, tag filtering, and sorting options.',
      },
    },
  },
  argTypes: {
    filter: {
      description: 'Current filter state',
      control: { type: 'object' },
    },
    categories: {
      description: 'Array of available categories',
      control: { type: 'object' },
    },
    allTags: {
      description: 'Array of all available tags',
      control: { type: 'object' },
    },
    filteredCount: {
      description: 'Number of notes matching current filters',
      control: { type: 'number' },
    },
    'onUpdate:filter': { action: 'update:filter' },
    onClearFilter: { action: 'clear-filter' },
  },
  args: {
    filter: defaultFilter,
    categories: mockCategories,
    allTags: ['important', 'work', 'personal', 'meeting', 'ideas', 'urgent'],
    filteredCount: 12,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActiveSearch: Story = {
  args: {
    filter: {
      ...defaultFilter,
      search: 'meeting notes',
    },
    filteredCount: 3,
  },
};

export const WithCategoryFilter: Story = {
  args: {
    filter: {
      ...defaultFilter,
      category: 'work',
    },
    filteredCount: 8,
  },
};

export const WithTagFilters: Story = {
  args: {
    filter: {
      ...defaultFilter,
      tags: ['important', 'urgent'],
    },
    filteredCount: 5,
  },
};

export const WithMultipleFilters: Story = {
  args: {
    filter: {
      ...defaultFilter,
      search: 'project',
      category: 'work',
      tags: ['important'],
      sortBy: 'title',
      sortOrder: 'asc',
    },
    filteredCount: 2,
  },
};

export const NoResults: Story = {
  args: {
    filter: {
      ...defaultFilter,
      search: 'nonexistent search term',
    },
    filteredCount: 0,
  },
};

export const ManyTags: Story = {
  args: {
    allTags: [
      'important', 'work', 'personal', 'meeting', 'ideas', 'urgent',
      'project', 'deadline', 'follow-up', 'brainstorming', 'research',
      'planning', 'development', 'design', 'testing', 'documentation'
    ],
  },
};

export const SingleResult: Story = {
  args: {
    filter: {
      ...defaultFilter,
      search: 'specific note',
    },
    filteredCount: 1,
  },
};
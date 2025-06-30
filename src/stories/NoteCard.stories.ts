import type { Meta, StoryObj } from '@storybook/vue3';
import NoteCard from '../components/NoteCard.vue';
import type { Note, Category } from '../types';

const mockCategories: Category[] = [
  { id: 'personal', name: 'Personal', color: '#6366f1' },
  { id: 'work', name: 'Work', color: '#10b981' },
  { id: 'ideas', name: 'Ideas', color: '#f59e0b' },
];

const mockNote: Note = {
  id: '1',
  title: 'Sample Note',
  content: 'This is a sample note content that demonstrates how the note card component looks with some text content.',
  category: 'personal',
  tags: ['important', 'sample'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  pinned: false,
};

const meta: Meta<typeof NoteCard> = {
  title: 'Components/NoteCard',
  component: NoteCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component that displays note information with actions for editing, pinning, duplicating, and deleting.',
      },
    },
  },
  argTypes: {
    note: {
      description: 'The note object to display',
      control: { type: 'object' },
    },
    categories: {
      description: 'Array of available categories',
      control: { type: 'object' },
    },
    onEdit: { action: 'edit' },
    onDelete: { action: 'delete' },
    onTogglePin: { action: 'toggle-pin' },
    onDuplicate: { action: 'duplicate' },
  },
  args: {
    note: mockNote,
    categories: mockCategories,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PinnedNote: Story = {
  args: {
    note: {
      ...mockNote,
      pinned: true,
    },
  },
};

export const LongContent: Story = {
  args: {
    note: {
      ...mockNote,
      title: 'A Very Long Note Title That Might Wrap to Multiple Lines',
      content: 'This is a much longer note content that demonstrates how the component handles longer text. It should truncate properly and show only the first few lines while maintaining good visual hierarchy and readability. The content continues here to show the line clamping behavior.',
    },
  },
};

export const NoTags: Story = {
  args: {
    note: {
      ...mockNote,
      tags: [],
    },
  },
};

export const ManyTags: Story = {
  args: {
    note: {
      ...mockNote,
      tags: ['important', 'work', 'meeting', 'urgent', 'follow-up', 'project'],
    },
  },
};

export const WorkCategory: Story = {
  args: {
    note: {
      ...mockNote,
      category: 'work',
      title: 'Work Meeting Notes',
      content: 'Discussion points from today\'s team meeting.',
      tags: ['work', 'meeting'],
    },
  },
};

export const IdeasCategory: Story = {
  args: {
    note: {
      ...mockNote,
      category: 'ideas',
      title: 'App Feature Ideas',
      content: 'Brainstorming session for new application features.',
      tags: ['ideas', 'brainstorming'],
    },
  },
};
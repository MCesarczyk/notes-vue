import type { Meta, StoryObj } from '@storybook/vue3';
import NoteEditor from '../components/NoteEditor.vue';
import type { Note, Category } from '../types';

const mockCategories: Category[] = [
  { id: 'personal', name: 'Personal', color: '#6366f1' },
  { id: 'work', name: 'Work', color: '#10b981' },
  { id: 'ideas', name: 'Ideas', color: '#f59e0b' },
];

const mockNote: Note = {
  id: '1',
  title: 'Existing Note',
  content: 'This is an existing note that can be edited.',
  category: 'work',
  tags: ['existing', 'editable'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  pinned: false,
};

const meta: Meta<typeof NoteEditor> = {
  title: 'Components/NoteEditor',
  component: NoteEditor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A modal component for creating and editing notes with form validation and tag management.',
      },
    },
  },
  argTypes: {
    note: {
      description: 'The note to edit (undefined for creating new note)',
      control: { type: 'object' },
    },
    categories: {
      description: 'Array of available categories',
      control: { type: 'object' },
    },
    onClose: { action: 'close' },
    onSave: { action: 'save' },
  },
  args: {
    categories: mockCategories,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateMode: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The editor in create mode for adding a new note.',
      },
    },
  },
};

export const EditMode: Story = {
  args: {
    note: mockNote,
  },
  parameters: {
    docs: {
      description: {
        story: 'The editor in edit mode with an existing note loaded.',
      },
    },
  },
};

export const WithManyTags: Story = {
  args: {
    note: {
      ...mockNote,
      tags: ['work', 'meeting', 'important', 'follow-up', 'project', 'deadline'],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Editor showing a note with multiple tags to demonstrate tag management.',
      },
    },
  },
};

export const LongContent: Story = {
  args: {
    note: {
      ...mockNote,
      title: 'Detailed Project Notes',
      content: `# Project Overview

This is a comprehensive note with detailed information about the project.

## Key Points
- First important point
- Second critical item
- Third consideration

## Next Steps
1. Review requirements
2. Create timeline
3. Assign resources
4. Begin implementation

## Notes
Additional thoughts and considerations for the project implementation.`,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Editor with longer content to show textarea behavior.',
      },
    },
  },
};
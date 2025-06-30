import type { Meta, StoryObj } from '@storybook/vue3';
import EmptyState from '../components/EmptyState.vue';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component that displays when there are no items to show, with optional call-to-action button.',
      },
    },
  },
  argTypes: {
    title: {
      description: 'The main heading text',
      control: { type: 'text' },
    },
    description: {
      description: 'The descriptive text below the title',
      control: { type: 'text' },
    },
    hideButton: {
      description: 'Whether to hide the action button',
      control: { type: 'boolean' },
    },
    onCreateNote: { action: 'create-note' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomText: Story = {
  args: {
    title: 'No search results',
    description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
  },
};

export const WithoutButton: Story = {
  args: {
    title: 'No matching notes',
    description: 'Your search didn\'t return any results.',
    hideButton: true,
  },
};

export const WelcomeMessage: Story = {
  args: {
    title: 'Welcome to Vue Notes!',
    description: 'Start organizing your thoughts and ideas by creating your first note.',
  },
};

export const ErrorState: Story = {
  args: {
    title: 'Something went wrong',
    description: 'We encountered an error while loading your notes. Please try refreshing the page.',
    hideButton: true,
  },
};
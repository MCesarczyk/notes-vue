import type { Meta, StoryObj } from '@storybook/vue3';

// Create a simple button component for demonstration
const Button = {
  template: `
    <button 
      :class="classes" 
      @click="onClick"
      :disabled="disabled"
    >
      <slot />
    </button>
  `,
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary'].includes(value),
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value: string) => ['small', 'medium', 'large'].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onClick: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    classes() {
      const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none';
      
      const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500',
      };
      
      const sizeClasses = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2',
        large: 'px-6 py-3 text-lg',
      };
      
      const disabledClasses = this.disabled ? 'opacity-50 cursor-not-allowed' : '';
      
      return [
        baseClasses,
        variantClasses[this.variant as keyof typeof variantClasses],
        sizeClasses[this.size as keyof typeof sizeClasses],
        disabledClasses,
      ].join(' ');
    },
  },
};

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with different variants and sizes used throughout the application.',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Button style variant',
      control: { type: 'select' },
      options: ['primary', 'secondary'],
    },
    size: {
      description: 'Button size',
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      description: 'Whether the button is disabled',
      control: { type: 'boolean' },
    },
    onClick: { action: 'clicked' },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Primary Button</Button>',
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Secondary Button</Button>',
  }),
};

export const Small: Story = {
  args: {
    size: 'small',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Small Button</Button>',
  }),
};

export const Large: Story = {
  args: {
    size: 'large',
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Large Button</Button>',
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Disabled Button</Button>',
  }),
};

export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 items-center">
          <Button variant="primary" size="small">Small Primary</Button>
          <Button variant="primary" size="medium">Medium Primary</Button>
          <Button variant="primary" size="large">Large Primary</Button>
        </div>
        <div class="flex gap-4 items-center">
          <Button variant="secondary" size="small">Small Secondary</Button>
          <Button variant="secondary" size="medium">Medium Secondary</Button>
          <Button variant="secondary" size="large">Large Secondary</Button>
        </div>
        <div class="flex gap-4 items-center">
          <Button variant="primary" disabled>Disabled Primary</Button>
          <Button variant="secondary" disabled>Disabled Secondary</Button>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All button variants and sizes displayed together for comparison.',
      },
    },
  },
};
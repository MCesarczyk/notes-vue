import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'Vue Notes App',
    brandUrl: '/',
    brandImage: undefined,
    brandTarget: '_self',
    
    colorPrimary: '#6366f1',
    colorSecondary: '#10b981',
    
    // UI
    appBg: '#f9fafb',
    appContentBg: '#ffffff',
    appBorderColor: '#e5e7eb',
    appBorderRadius: 8,
    
    // Typography
    fontBase: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontCode: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    
    // Text colors
    textColor: '#1f2937',
    textInverseColor: '#ffffff',
    
    // Toolbar default and active colors
    barTextColor: '#6b7280',
    barSelectedColor: '#6366f1',
    barBg: '#ffffff',
    
    // Form colors
    inputBg: '#ffffff',
    inputBorder: '#d1d5db',
    inputTextColor: '#1f2937',
    inputBorderRadius: 6,
  },
});
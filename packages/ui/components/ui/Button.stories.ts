import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = { component: Button };
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'default', children: 'Hello' },
};

export const Secoundary: Story = {
  args: { variant: 'secondary', children: 'Hello' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Hello' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Hello' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Hello' },
};

export const Link: Story = {
  args: { variant: 'link', children: 'Hello' },
};

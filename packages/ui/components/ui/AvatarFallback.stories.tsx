import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarFallback } from './Avatar';

const meta: Meta<typeof AvatarFallback> = {
  title: 'UI/Avatar/AvatarFallback',
  component: AvatarFallback,
  decorators: [
    Story => (
      <Avatar>
        <Story />
      </Avatar>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AvatarFallback>;

export const Primary: Story = {
  args: {
    children: 'CN',
  },
};

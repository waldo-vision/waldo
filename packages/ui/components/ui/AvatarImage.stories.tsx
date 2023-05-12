import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage } from './Avatar';

const meta: Meta<typeof AvatarImage> = {
  title: 'UI/Avatar/AvatarImage',
  component: AvatarImage,
  decorators: [
    Story => (
      <Avatar>
        <Story />
      </Avatar>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AvatarImage>;

export const Primary: Story = {
  args: {
    src: 'https://github.com/waldo-vision.png',
    alt: 'Waldo Vision Logo',
  },
};

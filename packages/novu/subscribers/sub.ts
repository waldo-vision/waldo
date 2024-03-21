import { novu } from '../novu';
const createSub = async (
  waldoId: string,
  email: string,
  name: string,
  avatar: string,
) => {
  await novu.subscribers.identify(waldoId, {
    email: email,
    firstName: name,
    avatar: avatar,
  });
};

const sendTest = async () => {
  await novu.trigger('primary', {
    to: {
      subscriberId: 'on-boarding-subscriber-id-123',
      email: 'email@email.com',
      firstName: 'Finn',
    },

    payload: {
      title: 'WALDO HUB',
      sender: 'Waldo INT LLC',
      content:
        'Test Message. Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.Test Message.',
    },
  });
};

const updateSub = async () => {
  return 'not implemented.';
};

export { createSub, updateSub, sendTest };

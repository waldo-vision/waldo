import { Box } from '@chakra-ui/react';
import { Turnstile } from '@marsidev/react-turnstile';
import { trpc } from '@utils/trpc';

interface WidgetProps {
  valid(valid: boolean): void;
}
enum CallbackStates {
  SUCCESS,
  ERROR,
  EXPIRE,
}

const TurnstileWidget = (props: WidgetProps) => {
  const utils = trpc.useContext();
  const verifyToken = trpc.util.verifyUser.useMutation({
    async onSuccess() {
      await utils.util.invalidate();
    },
  });
  const handleCallback = async (token: string, state: CallbackStates) => {
    // check for token
    if (state == CallbackStates.SUCCESS) {
      const result = await verifyToken.mutateAsync({ tsToken: token });
      if (result.result) {
        props.valid(true);
      } else {
        props.valid(false);
      }
    } else if (state == CallbackStates.ERROR) {
      props.valid(false);
    } else if (state == CallbackStates.EXPIRE) {
      props.valid(false);
    }
  };

  return (
    <div>
      <Box>
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
          options={{
            theme: 'light',
            size: 'normal',
          }}
          onSuccess={token => handleCallback(token, CallbackStates.SUCCESS)}
          onError={() => handleCallback('Network Error', CallbackStates.ERROR)}
          onExpire={() =>
            handleCallback('Token Expired', CallbackStates.EXPIRE)
          }
        />
      </Box>
    </div>
  );
};

export default TurnstileWidget;

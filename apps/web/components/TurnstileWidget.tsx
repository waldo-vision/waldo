import { Box } from '@chakra-ui/react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useRef, useEffect } from 'react';
interface WidgetProps {
  valid(valid: boolean, tsToken?: string): void;
  refreshState: number;
}
enum CallbackStates {
  SUCCESS,
  ERROR,
  EXPIRE,
}

const TurnstileWidget = (props: WidgetProps) => {
  const ref = useRef(null);
  useEffect(() => {
    if (props.refreshState > 0) {
      //@ts-ignore
      ref.current?.reset();
    }
  }, [props.refreshState]);
  const handleCallback = async (token: string, state: CallbackStates) => {
    // check for token
    if (state == CallbackStates.SUCCESS) {
      props.valid(true, token);
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
          ref={ref}
        />
      </Box>
    </div>
  );
};

export default TurnstileWidget;

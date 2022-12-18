import React from 'react';
import { Box } from '@chakra-ui/react';
import { Turnstile } from '@marsidev/react-turnstile';

const TurnstileWidget = () => {
  return (
    <div>
      <Box>
        <Turnstile
          siteKey="1x00000000000000000000AA"
          options={{
            theme: 'light',
            size: 'normal',
          }}
        />
      </Box>
    </div>
  );
};

export default TurnstileWidget;

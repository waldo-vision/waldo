import React, { useState } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import { Turnstile } from '@marsidev/react-turnstile';

const TurnstileWidget = () => {
  const [token, setToken] = useState<string>();
  return (
    <div>
      <Box>
        <Turnstile
          siteKey="1x00000000000000000000AA"
          options={{
            theme: 'light',
            size: 'normal',
          }}
          onSuccess={token => setToken(token)}
        />
      </Box>
    </div>
  );
};

export default TurnstileWidget;

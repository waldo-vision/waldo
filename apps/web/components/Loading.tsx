import React from 'react';
import {
  Spinner,
  Center,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
} from '@chakra-ui/react';
import { NextPage } from 'next';

interface Props {
  color: string;
}

const Loading: NextPage<Props> = props => {
  const { color } = props;
  return (
    <div>
      <Center h={'100vh'}>
        <Flex
          direction={'column'}
          alignItems={'center'}
          h={'inherit'}
          justifyContent={'space-evenly'}
        >
          <Box>
            <Spinner color={color && color} size={'xl'} />
          </Box>
          <Alert status={'error'} borderRadius={12}>
            <AlertIcon />
            <AlertTitle>Your Account is suspended</AlertTitle>
            <AlertDescription>
              Some data may appear absent or incomplete and may not load.
            </AlertDescription>
          </Alert>
        </Flex>
      </Center>
    </div>
  );
};

export default Loading;

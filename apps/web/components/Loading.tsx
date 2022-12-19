import React from 'react';
import { Spinner, Center, Box } from '@chakra-ui/react';
import { NextPage } from 'next';

interface Props {
  color: string;
}

const Loading: NextPage<Props> = props => {
  const { color } = props;
  return (
    <div>
      <Center h={'100vh'}>
        <Box>
          <Spinner color={color && color} size={'xl'} />
        </Box>
      </Center>
    </div>
  );
};

export default Loading;

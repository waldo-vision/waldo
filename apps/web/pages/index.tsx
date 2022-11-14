import type { ReactElement } from 'react';
import Layout from '@components/Layout';
import {
  Button,
  ButtonGroup,
  Center,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <div>
      <Center h={'100vh'}>
        <Flex
          direction={'column'}
          textAlign={'center'}
          alignItems={'center'}
          gap={'5px'}
        >
          <Heading fontSize={'57px'} py={2} textAlign={'center'}>
            Waldo
          </Heading>
          <Flex>
            <Text fontSize={'27px'} textAlign={'center'}>
              <b>Open-source </b>
              <span>visual cheat detection, </span>
              <br />
              <b>powered by A.I</b>
            </Text>
          </Flex>
          <Text fontSize={'l'} fontWeight={'thin'}>
            Currently in construction
          </Text>
          <ButtonGroup gap="4" m={3}>
            <Button variant={'solid'}>Clip Submission</Button>
            <Button variant={'outline'}>Learn more</Button>
          </ButtonGroup>
        </Flex>
      </Center>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import type { ReactElement } from 'react';
import Layout from '@components/Layout';
import {ArrowUpTrayIcon, ArrowRightIcon} from '@heroicons/react/24/outline'
import {
  Button,
  ButtonGroup,
  Center,
  Heading,
  Text,
  Flex,
  Link,
  Image,
  Box
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
            <Button variant={'solid'} colorScheme='purple'>            
            <ArrowUpTrayIcon height={16} width={16}/>
            <Text marginLeft={2}>Clip Submission</Text>
            </Button>
            <Button variant={'outline'} colorScheme='purple'>
            <Text marginRight={2}>Learn More</Text>
            <ArrowRightIcon height={16} width={16}/>
            </Button>
          </ButtonGroup>
        </Flex>
      </Center>
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import React from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
const Finish = () => {
  const router = useRouter();
  return (
    <div>
      <Flex
        bgColor={'white'}
        borderRadius={12}
        p={8}
        w={'35vh'}
        direction={'column'}
      >
        <Text fontWeight={'bold'} fontSize={15}>
          Congrats, you reviewed 20 documents!
        </Text>
        <Flex direction={'row'} mt={4}>
          <Text
            fontWeight={'normal'}
            fontSize={10}
            textDecoration={'underline'}
            mt={3}
            cursor={'pointer'}
            _hover={{ textColor: 'purple.600' }}
          >
            Review 20 more
          </Text>
          <Button
            color={'white'}
            bgColor={'#373737'}
            _hover={{ bgColor: '#474747' }}
            mr={3}
            ml={'auto'}
            right={0}
            onClick={() => router.push('/')}
          >
            Go Home
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default Finish;

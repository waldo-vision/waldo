import Layout from '@components/Layout';
import React, { ReactElement } from 'react';
import {
  Box,
  ButtonGroup,
  Flex,
  Image,
  Text,
  Center,
  chakra,
} from '@chakra-ui/react';
export default function Upload() {
  return (
    <Box w="100%">
      <Center h={'100vh'}>
        <Flex
          direction={'column'}
          textAlign={'center'}
          alignItems={'center'}
          gap={'5px'}
        >
          <Flex
            w={'550px'}
            h={'250px'}
            bgColor={'white'}
            bgRepeat="no-repeat"
            bgImage={'upload_rec.png'}
            bgPosition={'center'}
            borderRadius={16}
            alignItems={'center'}
            direction={'column'}
          >
            <Center h={'100vh'}>
              <Flex direction={'column'} alignItems={'center'}>
                <Image
                  src="upload_folder.png"
                  width={55}
                  height={50}
                  alt={'folder'}
                />
                <chakra.span paddingTop={4} fontWeight={'bold'}>
                  Drop your clips here, or{' '}
                  <chakra.span color={'purple.500'} cursor={'pointer'}>
                    browse
                  </chakra.span>{' '}
                </chakra.span>
                <Text fontSize={'xx-small'}>Supports MP4, MOV</Text>
              </Flex>
            </Center>
          </Flex>

          <Box fontSize={'sm'} paddingTop={2}>
            <chakra.span fontWeight={'normal'}>
              By proceeding, you agree to the{' '}
              <chakra.span fontWeight={'bold'}>
                Terms <br /> of Service{' '}
              </chakra.span>
              and <chakra.span fontWeight={'bold'}>Privacy Notice </chakra.span>
            </chakra.span>
          </Box>
          <ButtonGroup gap="4" m={3}></ButtonGroup>
        </Flex>
      </Center>
    </Box>
  );
}
Upload.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

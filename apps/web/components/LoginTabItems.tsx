import React from 'react';
import { Box, Center, Flex, Text, Tabs, Tab, TabList } from '@chakra-ui/react';
const LoginTabItems = () => {
  const items = [{}, {}, {}];
  return (
    <div>
      <Flex direction={'row'}>
        <Center w={'100vh'}>
          <Tabs>
            <TabList>
              {items.map((it, i) => (
                <Tab
                  key={i}
                  _focus={{
                    borderRadius: 20,
                    borderWidth: 1,
                    bgColor: 'gray.700',
                  }}
                  borderWidth={1}
                  color={'gray.700'}
                  borderRadius={20}
                  w={'15vh'}
                  mr={3}
                  my={8}
                ></Tab>
              ))}
            </TabList>
          </Tabs>
        </Center>
      </Flex>
    </div>
  );
};

export default LoginTabItems;

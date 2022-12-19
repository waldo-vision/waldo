import React, { useEffect, useState } from 'react';
import { Box, Flex, Center, Text, Image } from '@chakra-ui/react';
import { FaRegUser } from 'react-icons/fa';
import { GrGamepad } from 'react-icons/gr';
import { FcLock } from 'react-icons/fc';
type Tab = {
  tabName: string;
  selected: boolean;
};
interface Props {
  callback(value: number): void;
}
const Sidebar = (props: Props) => {
  const sidebarTabs = [
    { tabName: 'Users', selected: true },
    { tabName: 'Roles/Permissions', selected: false },
    { tabName: 'Gameplay', selected: false },
  ];
  const [tabs, setTabs] = useState<Array<Tab>>(sidebarTabs);
  const [prevTab, setPrevTab] = useState<number>(0);
  const handleTabSelect = (i: number) => {
    props.callback(i);

    tabs[i].selected = true;
    tabs[prevTab].selected = false;

    setPrevTab(i);
  };
  useEffect(() => {
    setTabs(sidebarTabs);
  }, []);
  return (
    <div>
      <Flex direction={'column'}>
        <Flex direction={'row'} m={6}>
          <Center h={'100%'}>
            <Image src={'../android-chrome-192x192.png'} w={12} h={12} />
            <Text ml={2} fontWeight={'bold'} fontSize={20}>
              Waldo
            </Text>
          </Center>
        </Flex>
        {tabs && (
          <Box>
            {tabs.map((tab, index) => (
              <Flex
                bgColor={tab.selected ? 'purple.500' : 'white'}
                borderRadius={16}
                p={3}
                alignItems={'center'}
                gap={2}
                key={index}
                ml={6}
                mb={4}
                cursor={'pointer'}
                _hover={
                  tab.selected
                    ? { bgColor: 'purple.600' }
                    : { bgColor: 'gray.400' }
                }
                onClick={() => handleTabSelect(index)}
              >
                {/* ICONS */}
                <Box pl={2}>
                  {index == 0 && (
                    <FaRegUser color={tab.selected ? 'white' : 'black'} />
                  )}
                  {index == 1 && <FcLock />}
                  {index == 2 && (
                    <GrGamepad color={tab.selected ? 'black' : 'white'} />
                  )}
                </Box>
                {/* NAMING */}
                <Box pr={2}>
                  <Text
                    fontWeight={'semibold'}
                    fontSize={14}
                    color={tab.selected ? 'white' : 'gray.700'}
                  >
                    {tab.tabName}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Box>
        )}
      </Flex>
    </div>
  );
};

export default Sidebar;

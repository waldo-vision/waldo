import {
  Button,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tooltip,
} from '@chakra-ui/react';
import { BsInfoCircle } from 'react-icons/bs';
import Sidebar from '@components/dashboard/Sidebar';
import Review from '@components/dashboard/site/Review';
import Upload from '@components/dashboard/site/Upload';
import Account from '@components/dashboard/site/Account';
import Stats from '@components/dashboard/site/Stats';
import Maintenance from '@components/dashboard/site/Maintenance';
import { ReactElement } from 'react';

type ServicesListType = {
  label: string;
  component: ReactElement;
};

const ServicesList: ServicesListType[] = [
  {
    label: 'Maintenance Mode',
    component: <Maintenance />,
  },
  {
    label: 'Security & Authentication',
    component: <Account />,
  },
  {
    label: 'Data Collection & Uploading',
    component: <Upload />,
  },
  {
    label: 'Gameplay Reviewing',
    component: <Review />,
  },
];

export default function Site() {
  return (
    <Sidebar>
      <Stats />
      <Heading mx={5} mt={2} fontSize={'2xl'}>
        Manage Service
      </Heading>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify={'space-between'}
        width={'100%'}
      >
        <StatGroup>
          {ServicesList.map(({ label, component }, index) => (
            <Stat
              minW={{ base: '80%', md: '40%' }}
              key={index}
              bgColor={'white'}
              borderRadius={16}
              p={5}
              m={5}
            >
              <StatLabel>{label}</StatLabel>
              <StatNumber>{component}</StatNumber>
              <StatHelpText>Manage {label} service.</StatHelpText>
            </Stat>
          ))}
        </StatGroup>
      </Flex>
    </Sidebar>
  );
}

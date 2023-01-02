import {
  Flex,
  Heading,
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import Review from '@components/dashboard/status/Review';
import Upload from '@components/dashboard/status/Upload';
import Account from '@components/dashboard/status/Account';
import Stats from '@components/dashboard/status/Stats';
import Maintenance from '@components/dashboard/status/Maintenance';
import { ReactElement } from 'react';
import Layout from '@components/dashboard/Layout';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

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

export default function Status() {
  return (
    <Flex direction={'column'}>
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
              <StatNumber>{component}</StatNumber>
              <StatHelpText>Manage {label} service.</StatHelpText>
            </Stat>
          ))}
        </StatGroup>
      </Flex>
    </Flex>
  );
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function getServerSideProps(context) {
  const user = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions,
  );
  if (user?.user?.role != 'ADMIN') return { redirect: { destination: '/404' } };
  else return { props: {} };
}

Status.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

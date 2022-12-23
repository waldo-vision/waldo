import { Flex } from '@chakra-ui/layout';
import Layout from '@components/dashboard/Layout';
import Sidebar from '@components/dashboard/Sidebar';
import { ReactElement } from 'react';

export default function Gameplay() {
  return (
    <div>
      <Flex direction={'row'}>
        <Sidebar />
      </Flex>
    </div>
  );
}

Gameplay.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

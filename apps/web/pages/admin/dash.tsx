import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import Sidebar from '@components/dashboard/Sidebar';
import User from '@components/dashboard/user/User';
import RolePerms from '@components/dashboard/rolperms/RolePerms';
import Gameplay from '@components/dashboard/gameplay/Gameplay';
const admin = () => {
  const [page, setPage] = useState<number>(0);
  return (
    <div>
      <Flex direction={'row'}>
        <Sidebar callback={page => setPage(page)} />
        <Box w={'100%'}>
          {page == 0 && <User />}
          {page == 1 && <RolePerms />}
          {page == 2 && <Gameplay />}
        </Box>
      </Flex>
    </div>
  );
};

export default admin;

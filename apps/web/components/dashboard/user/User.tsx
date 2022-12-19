import React from 'react';
import SearchFilters from './SearchFilters';
import Main from './Main';
import { Flex } from '@chakra-ui/react';

const User = () => {
  return (
    <div>
      <Flex direction={'column'} w={'inherit'}>
        <SearchFilters />
      </Flex>
    </div>
  );
};

export default User;

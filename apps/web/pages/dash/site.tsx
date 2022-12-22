import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  Switch,
  Button,
  Text,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import Sidebar from '@components/dashboard/Sidebar';
import { trpc } from '@utils/trpc';
import Loading from '@components/Loading';
import Review from '@components/dashboard/site/Review';
import Upload from '@components/dashboard/site/Upload';
import Account from '@components/dashboard/site/Account';
import WaldoSite from '@components/dashboard/site/WaldoSite';

export default function Site() {
  return (
    <div>
      <Flex direction={'row'}>
        <Box>
          <Sidebar />
        </Box>
        <Flex direction={'column'}>
          <Flex direction={'row'}>
            <Review />
            <Upload />
            <Account />
          </Flex>
          <Flex direction={'column'}>
            <WaldoSite />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}

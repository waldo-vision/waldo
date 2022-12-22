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
export default function Site() {
  return (
    <div>
      <Flex direction={'row'} w={'full'}>
        <Sidebar />
        <Review />
      </Flex>
    </div>
  );
}

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

export default function Site() {
  const [showCustomReason, setShowCustomReason] = useState<boolean>(false);
  const [pageDisabled, setPageDisabled] = useState<boolean>(false);
  useEffect(() => {}, []);

  return (
    <div>
      <Flex direction={'row'}>
        <Sidebar />
        <Flex w={'inherit'} p={12} direction={'column'}>
          <Flex bgColor={'white'} borderRadius={14} direction={'column'}>
            <Box
              py={2}
              borderTopRadius={14}
              bgColor={pageDisabled ? 'red.400' : 'green.400'}
            ></Box>
            <Box p={4}>
              <Text fontWeight={'semibold'} fontSize={'3xl'}>
                Review
              </Text>
              <Flex mt={2} direction={'row'} alignItems={'center'} gap={2}>
                <Text fontWeight={'normal'} fontSize={'lg'}>
                  Disabled
                </Text>
                <Switch
                  size={'md'}
                  onChange={() => setPageDisabled(!pageDisabled)}
                />
              </Flex>
              <Flex mt={2} direction={'row'} alignItems={'center'} gap={2}>
                <Text fontWeight={'normal'} fontSize={'lg'}>
                  Custom Reason
                </Text>
                <Switch
                  size={'md'}
                  onChange={() => setShowCustomReason(!showCustomReason)}
                />
              </Flex>
              {showCustomReason && (
                <Stack spacing={4} mt={4}>
                  <InputGroup>
                    <InputLeftAddon
                      children={
                        <Box _hover={{ bgColor: 'gray.300', borderRadius: 12 }}>
                          <BsCheckCircle size={22} cursor={'pointer'} />
                        </Box>
                      }
                    />
                    <Input placeholder="Custom Reason" />
                  </InputGroup>
                </Stack>
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
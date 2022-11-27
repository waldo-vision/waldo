import { Box, Button, Center, Flex, FormControl, FormLabel, Image, Input, Text, chakra, Divider } from '@chakra-ui/react';
import Layout from '@components/Layout';
import Link from 'next/link';
import React, { ReactElement, useState, useEffect } from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
const Login = () => {
    const [formError, setFormError] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
  return (
    <div>
        <Center h={'100vh'}>
        <Flex 
          alignItems={'center'} 
          backgroundColor={'white'}
          borderRadius={8}
          borderColor={'white'}
          borderWidth={1}
        >
          <Box my={10} mx={10}>
            {/* Title Container */}
            <Center>
            <Box mb={12}>
              <Text fontWeight={'bold'} fontSize={40}>Sign In</Text>
            </Box>
            </Center>
            {/* main form flex box */}
            <Flex direction={'column'} gap={6}>
            {/* Email Input */}
            <Box>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type='email' borderRadius={15} placeholder="me@example.com" w={'xs'}/>
            </FormControl>
            </Box>
            {/* Password Input */}
            <Box>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type='password' borderRadius={15} placeholder="Enter your Password" w={'xs'}/>
            </FormControl>
            </Box>
            {/* signin button */}
            <Box>
              <Button 
              boxShadow={'lg'} 
              color={'white'} 
              backgroundColor={'blackAlpha.800'} 
              minWidth={'full'}
              borderRadius={10}
              _hover={{ backgroundColor: "blackAlpha.700" }}
              >
                Sign In
              </Button>
            </Box>
            {/* Login Footer and divider */}
            <Box>
              {/* legal statement */}
              <Box>
                <Center>
                <Text fontSize={14}>
                  Don't have an account?&nbsp; 
                  <chakra.span 
                  fontWeight={'bold'}
                  cursor={'pointer'}
                  _hover={{ textDecoration: "underline" }}
                  >
                    <Link href={'/auth/signup'}>Sign up</Link>
                  </chakra.span>
                </Text>
                </Center>
              </Box>
              {/* Other options divider */}
              <Box mt={5}>
                <Center>
                <Divider 
                orientation='horizontal' 
                w={'full'} 
                
                />
                <Box mx={6}>
                  {/* cheap way of doing this but for now it's fine; see below */}
                <Text fontSize={'sm'} textColor={'gray.500'} fontWeight={'semibold'}>or&nbsp;log&nbsp;in&nbsp;with</Text>
                </Box>
                <Divider 
                orientation='horizontal' 
                w={'full'} 
                 
                />
                </Center>
              </Box>
            </Box>
            </Flex>
            {/* social login options */}
            <Flex direction={'row'} justifyContent={'space-between'} mt={6}>
              <Box>
                <FcGoogle size={40}/>
              </Box>
              <Box>
                <FaDiscord size={40} color={'#6A5ACD'}/>
              </Box>
              <Box>
                <FaGithub size={40} color={'black'}/>
              </Box>
            </Flex>
          </Box>
        </Flex>
        </Center>
    </div>
  )
}

export default Login

Login.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
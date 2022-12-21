import { Box, Button, Center, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter } from '@chakra-ui/react';
import Layout from '@components/Layout';
import { Session } from 'next-auth'
import { signIn, getSession, signOut } from 'next-auth/react';
import React, { ReactElement, useState, useEffect } from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
const Login = () => {
    const [formError, setFormError] = useState<boolean>(false);
    const [userSession, setUserSession] = useState<Session | null>();
    const [email, setEmail] = useState<string>();
    const [attemptedLoginProvider, setAttemptedLoginProvider] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const retrieveUserSession = async () => {
      const session = await getSession()
      setUserSession(session)

    }

    const login = async (type: string) => {
      setAttemptedLoginProvider(type)

      if (userSession) {
        setIsOpen(true)
        console.log("is session")
        return;
      }
      setIsOpen(false)
      if(type == "discord") {
        signIn("discord")
      } else if (type == "github") {
        signIn("github")
      } else if (type == "google") {
        signIn("google")
      }
    }
    useEffect(() => {
      retrieveUserSession()
    }, [])

  return (
    <div>
        <Center h={'100vh'}>
        <Flex 
          alignItems={'center'} 
          backgroundColor={'white'}
          borderRadius={15}
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
            {/*
  
            <Flex direction={'column'} gap={6}>
            <Box>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type='email' borderRadius={15} placeholder="me@example.com" w={'xs'}/>
            </FormControl>
            </Box>
            <Box>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type='password' borderRadius={15} placeholder="Enter your Password" w={'xs'}/>
            </FormControl>
            </Box>
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
            <Box>
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
              <Box mt={5}>
                <Center>
                <Divider 
                orientation='horizontal' 
                w={'full'} 
                
                />
                <Box mx={6}>
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
            */}
            {/* social login options */}
            <Flex direction={'row'} justifyContent={'space-between'} width={'xs'} grow={'unset'}>
              <Box cursor={'pointer'}
              borderWidth={6}
              borderColor={'white'}
              onClick={
                () => login("google")
              }
              _hover={
                { borderColor: "gray.200", borderRadius: 8, borderWidth: 6, backgroundColor: "gray.200"}
                }>
                <FcGoogle size={40}/>
              </Box>
              <Box cursor={'pointer'}
              borderWidth={6}
              borderColor={'white'}
              onClick={
                () => login("discord")
              }
              _hover={
                { borderColor: "gray.200", borderRadius: 8, borderWidth: 6, backgroundColor: "gray.200"}
                }>
                <FaDiscord size={40} color={'#6A5ACD'}/>
              </Box>
              <Box 
              cursor={'pointer'}
              borderWidth={6}
              borderColor={'white'}
              onClick={
                () => login("github")
              }
              _hover={
                { borderColor: "gray.200", borderRadius: 8, borderWidth: 6, backgroundColor: "gray.200"}
                }>
              
                <FaGithub size={40} color={'black' } />
              </Box>
            </Flex>
          </Box>
        </Flex>
        
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account Linking</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
             To prevent accidental account linking, please confirm that you wish to link 
             your current account; {userSession && userSession.user.provider} with the account you are trying to login to; {attemptedLoginProvider && attemptedLoginProvider}.
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='purple' mr={3} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme='purple' mr={3} onClick={() => signOut()}>
              Logout
            </Button>
            <Button variant='outline' onClick={
              () => 
                signIn(attemptedLoginProvider)
            }>Continue</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </Center>
    </div>
  )
}

export default Login

Login.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
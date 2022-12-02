import { Box, Button, Center, Flex, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter } from '@chakra-ui/react';
import Layout from '@components/Layout';
import { Session } from 'next-auth'
import { signIn, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router'
import { ReactElement, useState, useEffect } from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export default function Login() {
  const [userSession, setUserSession] = useState<Session | null>();
  const [attemptedLoginProvider, setAttemptedLoginProvider] = useState<string>();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const router = useRouter()

  const getCurrentSession = async () => {
    await getSession()
      .then((session) => {
        if (session != null) {
          router.push('/account')
        }
        setUserSession(session);
      })
  };

  const login = async (type: string) => {
    setAttemptedLoginProvider(type)

    if (userSession) {
      setIsOpen(true)
      console.log("is session")
      return;
    }
    setIsOpen(false)
    if (type == "discord") {
      signIn("discord")
    } else if (type == "github") {
      signIn("github")
    } else if (type == "google") {
      signIn("google")
    }
  }
  useEffect(() => {
    getCurrentSession()
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

            {/* social login options */}
            <Flex direction={'row'} justifyContent={'space-between'} width={'xs'} grow={'unset'}>
              <Box cursor={'pointer'}
                borderWidth={6}
                borderColor={'white'}
                onClick={
                  () => login("google")
                }
                _hover={
                  { borderColor: "gray.200", borderRadius: 8, borderWidth: 6, backgroundColor: "gray.200" }
                }>
                <FcGoogle size={40} />
              </Box>
              <Box cursor={'pointer'}
                borderWidth={6}
                borderColor={'white'}
                onClick={
                  () => login("discord")
                }
                _hover={
                  { borderColor: "gray.200", borderRadius: 8, borderWidth: 6, backgroundColor: "gray.200" }
                }>
                <FaDiscord size={40} color={'#6A5ACD'} />
              </Box>
              <Box
                cursor={'pointer'}
                borderWidth={6}
                borderColor={'white'}
                onClick={
                  () => login("github")
                }
                _hover={
                  { borderColor: "gray.200", borderRadius: 8, borderWidth: 6, backgroundColor: "gray.200" }
                }>

                <FaGithub size={40} color={'black'} />
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

Login.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

import { Box, Button, Center, Flex, FormControl, FormLabel, Image, Input, Text, chakra } from '@chakra-ui/react';
import Layout from '@components/Layout';
import React, { ReactElement, useState, useEffect } from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
const Auth = () => {
    const [formError, setFormError] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
  return (
    <div>
        <Center h={'100vh'}>
        <Flex alignItems={'center'} backgroundColor={'#43475F'} borderColor={'#43475F'} borderRadius={10} borderWidth={1}>
            <Box marginLeft={8} marginRight={8} marginTop={3} marginBottom={3}>
                <Text color={'white'} fontWeight={'semibold'} fontSize={'3xl'} paddingBottom={6}>Sign In</Text>
                {/* Email and password Login */}
                <Box>
                    <Box>
                    <FormControl isInvalid={formError}>
                        <FormLabel color={'white'}>Email and Password</FormLabel>
                        <Input 
                        type='email' 
                        value={email} 
                        onChange={event => setEmail(event.target.value)} 
                        placeholder={"Email"} 
                        borderColor={"purple.400"} 
                        focusBorderColor={'purple.400'} 
                        marginBottom={5}
                        />
                        
                        <br/>

                        <Input 
                        type='text' 
                        color={'white'} 
                        value={password} 
                        onChange={event => setPassword(event.target.value)} 
                        placeholder={"********"} 
                        borderColor={"purple.400"} 
                        focusBorderColor={'purple.400'}
                        />
                    </FormControl>
                        <Button 
                        colorScheme={'purple'} 
                        size={'md'}
                        marginTop={6}
                        paddingLeft={5}
                        paddingRight={5}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
                {/* Social logins */}
                <Flex 
                direction={'row'} 
                justifyContent={'space-between'} 
                alignItems={'center'}
                marginTop={6}
                >
                    <Box 
                    backgroundColor={'white'} 
                    borderColor={'white'} 
                    borderWidth={6}
                    borderRadius={12}
                    > 
                        <FaDiscord style={{color: "#5865F2", height: "38", width: "38"}}/>
                    </Box>
                    <Box 
                    backgroundColor={'white'} 
                    borderColor={'white'} 
                    borderWidth={6}
                    borderRadius={12}
                    > 
                        <FcGoogle style={{height: "38", width: "38"}}/>
                    </Box>
                    <Box 
                    backgroundColor={'white'} 
                    borderColor={'white'} 
                    borderWidth={6}
                    borderRadius={12}
                    > 
                        <FaGithub style={{color: "black", height: "38", width: "38"}}/>
                    </Box>
                </Flex>
                <Box marginTop={4}>
                        <Text 
                        color={"gray.100"} 
                        fontSize={'sm'}
                        fontWeight={'medium'}
                        >
                            By signing up, you accept the&nbsp;
                            <chakra.span 
                            textDecoration={'underline'}
                            fontWeight={'bold'}
                            color={'gray.200'}
                            >
                                Terms of Service
                        </chakra.span>
                    </Text>
                    </Box>
            </Box>
        </Flex>
        </Center>
    </div>
  )
}

export default Auth

Auth.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };
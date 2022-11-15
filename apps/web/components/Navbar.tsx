/* eslint-disable arrow-parens */
import { Box, Button, ButtonGroup, Flex, Heading, Spacer, Image, Link } from '@chakra-ui/react';
import { ReactElement } from 'react';
import Layout from '@components/Layout';
export default function Navbar() {
  // allows for changes that need to be made, easier to implement
  const githubIconHref = "https://github.com/waldo-vision"
  const discordRedirect = "https://discord.gg/MPAV4qP8Hx"
  const buttonMenu = [
    { buttonTitle: "Upload", redirect: "/upload", external: false},
    { buttonTitle: "Docs", redirect: "", external: true},
    { buttonTitle: "Community", redirect: discordRedirect, external: true}
    ]

  return <div>
    <Flex minWidth='max-content' alignItems='center' gap='2' position={'fixed'} w="100%">
  <Flex flexDirection={'row'} paddingLeft={12} paddingTop={2} alignItems='center'>
    <Image src="android-chrome-192x192.png" width={9} height={9} alt="Logo"/>
    <Heading size={'md'} paddingLeft={3}>Waldo</Heading>
  </Flex>
  <Spacer />
  <Box p='2' paddingRight={12} paddingTop={2} >
  <ButtonGroup gap='2'>
    {buttonMenu.map(button => {
      return (
        <Link href={button.redirect} isExternal={button.external}>
      <Button variant={'ghost'} colorScheme='gray'>{button.buttonTitle}</Button>
        </Link>
      )
    })}
    <Button variant={'ghost'} colorScheme='gray'>
      <Link href={githubIconHref} isExternal>
      <Image src="navbar_github.png" width={9} height={9}/>
      </Link>
    </Button>
  </ButtonGroup>
  </Box>
</Flex>
</div>;
}

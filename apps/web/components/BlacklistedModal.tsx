import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  chakra,
  useDisclosure,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
interface Props {
  show: boolean;
}
export default function BlacklistedModal(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef(null);
  useEffect(() => {
    if (props.show) {
      onOpen();
    }
  }, [onOpen, props.show]);
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ALERT: Your account has been suspended
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                Your waldo account has been suspended. To find out more contact
                appeals@waldo.vision or go to &nbsp;
                <chakra.span
                  fontWeight={'semibold'}
                  textDecor={'underline'}
                  cursor={'pointer'}
                >
                  <Link href={'/account'}>My account.</Link>
                </chakra.span>
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  onClose;
                  signOut();
                }}
              >
                Logout
              </Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                I understand
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

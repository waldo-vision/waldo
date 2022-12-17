import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import { FaDiscord, FaBattleNet, FaSteam, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { SiFaceit } from 'react-icons/si';
import { trpc } from '@utils/trpc';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import Loading from './Loading';
import { useRouter } from 'next/router';

const DeleteAccModal = ({ show }) => {
  const [showModal, setShowModal] = useState<boolean | null>(null);
  const [userSession, setUserSession] = useState<Session | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const utils = trpc.useContext();
  const router = useRouter();

  const getCurrentSession = async () => {
    const session = await getSession();
    if (session) {
      setUserSession(session);
    } else {
      setUserSession(undefined);
    }
  };
  useEffect(() => {
    if (showModal == null) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
    getCurrentSession();
  }, [show]);
  const deleteUser = trpc.user.deleteUser.useMutation({
    async onSuccess() {
      await utils.user.invalidate();
    },
  });

  const handleDelete = async () => {
    window.location.reload();

    await deleteUser.mutateAsync({ userId: userSession?.user?.id });
  };
  return (
    <div>
      <Box>
        {loading ? (
          <Loading color={'default'} />
        ) : (
          <Modal isOpen={showModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Account Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  This is a destructive action. Click continue if you wish to
                  delete your primary account and all other accounts that are
                  linked with your primary.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={() => handleDelete()}>
                  Delete Account
                </Button>
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </div>
  );
};

export default DeleteAccModal;

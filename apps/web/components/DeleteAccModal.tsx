import { useState, useEffect } from 'react';
import {
  Box,
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
import { trpc } from '@utils/trpc';
import { getSession } from 'next-auth/react';
import Loading from './Loading';
interface Props {
  show: boolean;
}
const DeleteAccModal = (props: Props) => {
  const [showModal, setShowModal] = useState<boolean | null>(false);
  const [userId, setUserId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const utils = trpc.useContext();

  const getCurrentSession = async () => {
    const session = await getSession();
    setUserId(session?.user?.id);
    setLoading(false);
  };
  useEffect(() => {
    setShowModal(props.show);
    getCurrentSession();
  }, [props.show]);
  const deleteUser = trpc.user.delete.useMutation({
    async onSuccess() {
      await utils.user.invalidate();
    },
  });

  const handleDelete = async () => {
    window.location.reload();

    await deleteUser.mutateAsync({ userId: userId as string });
  };
  return (
    <div>
      <Box>
        {loading && props.show ? (
          <Loading color={'purple.500'} />
        ) : (
          <Modal
            isOpen={showModal as boolean}
            onClose={() => {
              return;
            }}
          >
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

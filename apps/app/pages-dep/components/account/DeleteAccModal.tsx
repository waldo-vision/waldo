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
  Spinner,
} from '@chakra-ui/react';
import { trpc } from '@utils/trpc';
import { getSession } from 'next-auth/react';
import Loading from '@components/Loading';
import { useRouter } from 'next/router';
import useSite from '@site';
interface Props {
  show: boolean;
}
const DeleteAccModal = (props: Props) => {
  const [showModal, setShowModal] = useState<boolean | null>(false);
  const [userId, setUserId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteButtonLoading, setDeleteButtonLoading] =
    useState<boolean>(false);
  const { setSession } = useSite();
  const router = useRouter();
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
    if (!deleteButtonLoading) {
      setDeleteButtonLoading(true);

      await deleteUser.mutateAsync({ userId: userId as string });
      setSession(null);

      router.push('/');
    }
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
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => handleDelete()}
                  disabled={deleteButtonLoading}
                >
                  {deleteButtonLoading ? (
                    <>
                      <Spinner color={'white'} size={'md'} />
                      &nbsp;Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  hidden={!!deleteButtonLoading}
                >
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

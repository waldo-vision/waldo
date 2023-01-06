import {
  Flex,
  Input,
  Switch,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useToast,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { trpc } from '@utils/trpc';
const WaldoSite = () => {
  const utils = trpc.useContext();
  const toast = useToast();
  const updateSite = trpc.site.updateSite.useMutation({
    async onSuccess() {
      await utils.site.invalidate();
    },
  });
  const { data, isLoading } = trpc.site.getSiteData.useQuery(
    {
      siteName: 'waldo',
    },
    {
      // every 15 seconds
      refetchInterval: 15000,
    },
  );
  const [alertDescription, setAlertDescription] = useState<string | null>(null);
  const [alertTitle, setAlertTitle] = useState<string | null>(null);

  const handleSwitchChanges = async (change: number) => {
    // if no data, then return (should never happen)
    if (!data) return;

    // change "0" changes the maintenance value for the site to on or off, depending on the current value
    if (change == 0) {
      await updateSite.mutateAsync({
        isCustomAlert: data.isCustomAlert,
        alertDescription: data.alertDescription,
        alertTitle: data.alertTitle,
        maintenance: !data.maintenance,
      });
      // change "1" changes the isCustomAlert value to on or off depending on the current value (either shows an alert on the main page or doesn't)
    } else if (change == 1) {
      await updateSite.mutateAsync({
        isCustomAlert: !data.isCustomAlert,
        alertDescription: data.alertDescription,
        alertTitle: data.alertTitle,
        maintenance: data.maintenance,
      });
    }
  };

  const applyChanges = async () => {
    if (!data) return;

    if (alertDescription == null || alertTitle == null) {
      toast({
        position: 'bottom-right',
        title: 'Error',
        description:
          "You can't apply changes when nothing was unchanged. You probably didn't type any text in the title or description inputs. ",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (alertDescription == null) {
      await updateSite.mutateAsync({
        isCustomAlert: data.isCustomAlert,
        alertDescription: data.alertDescription,
        alertTitle: alertTitle,
        maintenance: !data.maintenance,
      });
    } else if (alertTitle == null) {
      await updateSite.mutateAsync({
        isCustomAlert: data.isCustomAlert,
        alertDescription: alertDescription,
        alertTitle: data.alertTitle,
        maintenance: data.maintenance,
      });
    } else {
      await updateSite.mutateAsync({
        isCustomAlert: data.isCustomAlert,
        alertDescription: alertDescription,
        alertTitle: alertTitle,
        maintenance: data.maintenance,
      });
    }
    window.location.reload();
  };

  return (
    <div>
      <Flex direction={'row'}>
        {!isLoading && (
          <Flex w={'inherit'} p={12} direction={'column'}>
            <Flex
              bgColor={'white'}
              borderRadius={14}
              direction={'column'}
              h={'inherit'}
            >
              <Box
                bgColor={data?.maintenance ? 'blue.400' : 'green.400'}
                borderTopRadius={14}
                py={2}
              ></Box>

              <Flex p={4} h={'inherit'} w={'inherit'} direction={'column'}>
                <Text fontWeight={'semibold'} fontSize={'3xl'}>
                  WALDO
                </Text>
                <Flex mt={2} direction={'row'} alignItems={'center'} gap={2}>
                  <Text fontWeight={'normal'} fontSize={'lg'}>
                    Maintenance Mode
                  </Text>
                  <Switch
                    size={'md'}
                    defaultChecked={data?.maintenance}
                    onChange={() => handleSwitchChanges(0)}
                  />
                </Flex>
                <Flex mt={2} direction={'row'} alignItems={'center'} gap={2}>
                  <Text fontWeight={'normal'} fontSize={'lg'}>
                    Show Alert
                  </Text>
                  <Switch
                    size={'md'}
                    defaultChecked={data?.isCustomAlert}
                    onChange={() => handleSwitchChanges(1)}
                  />
                </Flex>
                {data?.isCustomAlert && (
                  <Flex direction={'column'}>
                    <Text fontStyle={'italic'} fontWeight={'thin'} mt={4}>
                      Click on title or description to edit the alert, then
                      click apply.
                    </Text>
                    <Alert
                      status="info"
                      borderRadius={16}
                      textColor={'white'}
                      bgColor={'purple.400'}
                    >
                      <AlertIcon color={'white'} />
                      <Flex direction={'column'}>
                        <AlertTitle>
                          <Input
                            variant={'unstyled'}
                            placeholder={
                              data?.alertTitle == ''
                                ? 'Title'
                                : (data?.alertTitle as string)
                            }
                            onChange={event =>
                              setAlertTitle(event.target.value)
                            }
                            _placeholder={{
                              textColor: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </AlertTitle>
                        <AlertDescription>
                          <Input
                            variant={'unstyled'}
                            placeholder={
                              data?.alertDescription == ''
                                ? 'Title'
                                : (data?.alertDescription as string)
                            }
                            onChange={event =>
                              setAlertDescription(event.target.value)
                            }
                            _placeholder={{
                              textColor: 'white',
                              fontWeight: 'normal',
                            }}
                          />
                        </AlertDescription>
                      </Flex>
                    </Alert>
                    <Flex direction={'row'}>
                      <Button
                        mt={3}
                        bgColor={'black'}
                        _hover={{ bgColor: 'gray.700' }}
                        color={'white'}
                        onClick={() => applyChanges()}
                      >
                        Apply
                      </Button>
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
    </div>
  );
};

export default WaldoSite;

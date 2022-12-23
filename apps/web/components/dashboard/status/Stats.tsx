import {
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  Flex,
} from '@chakra-ui/react';
import { FaCircle, FaExclamationCircle } from 'react-icons/fa';
import { trpc } from '@utils/trpc';
export default function Stats() {
  const { data: aData, isLoading: aLoading } = trpc.site.getPageData.useQuery({
    name: 'account',
  });
  const { data: rData, isLoading: rLoading } = trpc.site.getPageData.useQuery({
    name: 'review',
  });
  const { data: uData, isLoading: uLoading } = trpc.site.getPageData.useQuery({
    name: 'upload',
  });

  return (
    <>
      {!aLoading && !rLoading && !uLoading && (
        <StatGroup>
          <Stat
            bgColor={'white'}
            borderRadius={16}
            p={5}
            m={5}
            minW={{ base: '80%', md: '30%' }}
          >
            <StatLabel>Security & Authentication</StatLabel>
            <StatNumber>
              {aData?.maintenance ? 'Possible Outage' : 'Operational'}
            </StatNumber>
            <StatHelpText>
              <Flex
                flexDirection={'row'}
                align={'center'}
                textAlign={'center'}
                gap={2}
              >
                <FaCircle
                  size={8}
                  color={aData?.maintenance ? 'orange' : 'green'}
                />
                <Text>
                  {aData?.maintenance
                    ? aData.alertTitle == '--+|[]'
                      ? 'Maintenance'
                      : aData.alertTitle
                    : 'No current issues.'}
                </Text>
              </Flex>
            </StatHelpText>
          </Stat>
          <Stat
            bgColor={'white'}
            borderRadius={16}
            p={5}
            m={5}
            minW={{ base: '80%', md: '30%' }}
          >
            <StatLabel>Data Collection</StatLabel>
            <StatNumber>
              {uData?.maintenance ? 'Possible Outage' : 'Operational'}
            </StatNumber>
            <StatHelpText>
              <Flex
                flexDirection={'row'}
                align={'center'}
                textAlign={'center'}
                gap={2}
              >
                <FaCircle
                  size={8}
                  color={uData?.maintenance ? 'orange' : 'green'}
                />
                <Text>
                  {uData?.maintenance
                    ? uData.alertTitle == '--+|[]'
                      ? 'Maintenance'
                      : uData.alertTitle
                    : 'No current issues.'}
                </Text>
              </Flex>
            </StatHelpText>
          </Stat>

          <Stat
            bgColor={'white'}
            borderRadius={16}
            p={5}
            m={5}
            minW={{ base: '80%', md: '30%' }}
          >
            <StatLabel>Gameplay Review</StatLabel>
            <StatNumber>
              {rData?.maintenance ? 'Possible Outage' : 'Operational'}
            </StatNumber>
            <StatHelpText>
              <Flex
                flexDirection={'row'}
                align={'center'}
                textAlign={'center'}
                gap={2}
              >
                <FaCircle
                  size={8}
                  color={rData?.maintenance ? 'orange' : 'green'}
                />
                <Text>
                  {rData?.maintenance
                    ? rData.alertTitle == '--+|[]'
                      ? 'Maintenance'
                      : rData.alertTitle
                    : 'No current issues.'}
                </Text>
              </Flex>
            </StatHelpText>
          </Stat>
        </StatGroup>
      )}
    </>
  );
}

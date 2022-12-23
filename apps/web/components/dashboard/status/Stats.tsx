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

export default function Stats() {
  return (
    <StatGroup>
      <Stat
        bgColor={'white'}
        borderRadius={16}
        p={5}
        m={5}
        minW={{ base: '80%', md: '30%' }}
      >
        <StatLabel>Security & Authentication</StatLabel>
        <StatNumber>Operational</StatNumber>
        <StatHelpText>
          <Flex
            flexDirection={'row'}
            align={'center'}
            textAlign={'center'}
            gap={2}
          >
            <FaCircle size={8} color={'green'} />
            <Text>No current issues.</Text>
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
        <StatNumber>Operational</StatNumber>
        <StatHelpText>
          <Flex
            flexDirection={'row'}
            align={'center'}
            textAlign={'center'}
            gap={2}
          >
            <FaCircle size={8} color={'green'} />
            <Text>No current issues.</Text>
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
        <StatNumber>Operational</StatNumber>
        <StatHelpText>
          <Flex
            flexDirection={'row'}
            align={'center'}
            textAlign={'center'}
            gap={2}
          >
            <FaCircle size={8} color={'green'} />
            <Text>No current issues.</Text>
          </Flex>
        </StatHelpText>
      </Stat>
    </StatGroup>
  );
}

import { Flex } from '@chakra-ui/layout';
import Sidebar from '@components/dashboard/Sidebar';

export default function Roleperms() {
  return (
    <div>
      <Flex direction={'row'}>
        <Sidebar />
      </Flex>
    </div>
  );
}

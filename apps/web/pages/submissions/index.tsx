import Layout from '@components/Layout';
import { ReactElement } from 'react';

export default function index() {
  return <div>Coming Soon!</div>;
}
index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

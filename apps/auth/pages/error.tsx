import { ReactElement } from 'react';
import { kratos } from '../lib/kratos';
import { useRouter } from 'next/router';

export default function error(): ReactElement {
  const router = useRouter();
  const errorid = router.query.id as string;
  const error = kratos.getFlowError({ id: errorid });

  return <>{JSON.stringify(error, undefined, 2)}</>;
}

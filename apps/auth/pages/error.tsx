import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { kratos } from '@/lib/utils';

export default function error(): ReactElement {
  const router = useRouter();
  const errorid = router.query.id as string;
  const error = kratos.getFlowError({ id: errorid }).catch(() => undefined);

  return <>{JSON.stringify(error, undefined, 2)}</>;
}

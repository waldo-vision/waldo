import { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/client';
import { UserAuthCard } from '@ory/elements';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useState } from 'react';

import { HandleError, KratosErrorResponse } from '../lib/hooks';
import { kratos } from '../lib/kratos';

// original source: https://github.com/ory/elements/blob/a340041ccdefecd24e860ecdfb47546862b15fc7/examples/nextjs-spa/src/pages/registration.tsx#L22-L149
export default function Registration(): ReactElement {
  const [flow, setFlow] = useState<RegistrationFlow>();
  const handleError = HandleError();
  const router = useRouter();

  const flowId = router.query.flow ? String(router.query.flow) : undefined;
  const returnTo = router.query.return_to
    ? String(router.query.return_to)
    : undefined;

  const getRegistrationFlow = useCallback(
    (id: string) =>
      kratos
        .getRegistrationFlow({ id })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch((error: AxiosError<KratosErrorResponse>) => handleError(error)),
    [handleError],
  );

  const createRegistrationFlow = useCallback(
    (returnTo?: string) =>
      kratos
        .createBrowserRegistrationFlow({
          returnTo,
        })
        .then(({ data }) => {
          setFlow(data);
          router
            .push(`?flow=${data.id}`, undefined, {
              shallow: true,
            })
            .catch(console.error);
        })
        .catch((error: AxiosError<KratosErrorResponse>) => handleError(error)),
    [handleError, router],
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (flowId) {
      if (!flow || flow.id !== flowId) {
        getRegistrationFlow(flowId).catch(
          (error: AxiosError) =>
            error.response?.status === 410 ?? createRegistrationFlow(returnTo),
        );
      }
      return;
    }

    createRegistrationFlow(returnTo).catch(console.error);
  }, [
    createRegistrationFlow,
    getRegistrationFlow,
    router.isReady,
    flowId,
    returnTo,
    flow,
  ]);

  const submitFlow = useCallback(
    (values: UpdateRegistrationFlowBody) => {
      kratos
        .updateRegistrationFlow({
          flow: String(flow?.id),
          updateRegistrationFlowBody: values,
        })
        .then(() => {
          if (flow?.return_to) {
            window.location.href = flow?.return_to;
            return;
          }
          router.push('/').catch(console.error);
        })
        .catch((error: AxiosError<KratosErrorResponse>) => handleError(error))
        .catch((error: AxiosError) => {
          switch (error.response?.status) {
            case 400:
              setFlow(error.response?.data as RegistrationFlow);
              break;
            case 422: {
              const flow = new URL(
                (
                  error.response.data as Record<string, string>
                ).redirect_browser_to,
                window.location.origin,
              ).searchParams.get('flow');

              router
                .push(
                  `/registration${flow ? `?flow=${flow}` : ''}`,
                  undefined,
                  {
                    shallow: true,
                  },
                )
                .catch(console.error);
              break;
            }
            default:
              return Promise.reject(error);
          }
        });
    },
    [flow, handleError, router],
  );

  return (
    <>
      {flow ? (
        <UserAuthCard
          cardImage="/ory.svg"
          title="Registration"
          flowType="registration"
          flow={flow}
          additionalProps={{
            loginURL: '/login',
          }}
          includeScripts={true}
          onSubmit={({ body }): void =>
            submitFlow(body as UpdateRegistrationFlowBody)
          }
        />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

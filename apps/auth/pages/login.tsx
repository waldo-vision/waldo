import { LoginFlow, UpdateLoginFlowBody } from '@ory/client';
import { UserAuthCard } from '@ory/elements';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { HandleError, KratosErrorResponse } from '../lib/hooks';
import { kratos } from '../lib/kratos';

// original source: https://github.com/ory/elements/blob/a340041ccdefecd24e860ecdfb47546862b15fc7/examples/nextjs-spa/src/pages/login.tsx#L22-L144
export default function Login(): ReactElement {
  const [flow, setFlow] = useState<LoginFlow | null>(null);
  const handleError = HandleError();
  const router = useRouter();

  const returnTo = router.query.return_to
    ? String(router.query.return_to)
    : undefined;
  const flowId = router.query.flow ? String(router.query.flow) : undefined;
  const loginChallenge = router.query.login_challenge
    ? String(router.query.login_challenge)
    : undefined;
  const refresh = Boolean(router.query.refresh);
  const aal = router.query.aal ? String(router.query.aal) : undefined;

  const getLoginFlow = useCallback(
    (id: string) =>
      kratos
        .getLoginFlow({ id })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch((error: AxiosError<KratosErrorResponse>) => handleError(error)),
    [handleError],
  );

  const createFlow = useCallback(
    (refresh: boolean, aal?: string, returnTo?: string) =>
      kratos
        .createBrowserLoginFlow({
          aal,
          loginChallenge,
          refresh,
          returnTo,
        })
        .then(({ data }) => {
          setFlow(data);
        })
        .catch((error: AxiosError<KratosErrorResponse>) => handleError(error)),
    [handleError, loginChallenge],
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (flowId) {
      if (!flow || flow.id !== flowId) {
        getLoginFlow(flowId).catch(
          (err: AxiosError) =>
            err.response?.status === 410 ?? createFlow(refresh, aal, returnTo),
        );
      }
      return;
    }

    if (!flow) {
      createFlow(refresh, aal, returnTo).catch(console.error);
    }
  }, [
    createFlow,
    getLoginFlow,
    refresh,
    aal,
    returnTo,
    flowId,
    router.isReady,
    flow,
  ]);

  const submitFlow = useCallback(
    (values: UpdateLoginFlowBody) => {
      if (!flow) {
        console.error('no login flow available');
        return;
      }

      router
        .push(`?flow=${flow.id}`, undefined, { shallow: true })
        .catch(console.error);

      kratos
        .updateLoginFlow({
          flow: String(flow?.id),
          updateLoginFlowBody: values,
        })
        .then(() => {
          if (flow?.return_to) {
            window.location.href = flow?.return_to;
            return;
          }

          router.push('/').catch(console.error);
        })
        .catch((err: AxiosError<KratosErrorResponse>) => handleError(err))
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 400:
              setFlow(err.response?.data as LoginFlow);
              break;
            case 422: {
              const flow = new URL(
                (
                  err.response.data as Record<string, string>
                ).redirect_browser_to,
                window.location.origin,
              ).searchParams.get('flow');

              router
                .push(`/login${flow ? `?flow=${flow}` : ''}`, undefined, {
                  shallow: true,
                })
                .catch(console.error);
              break;
            }
            default:
              return Promise.reject(err);
          }
        });
    },
    [flow, handleError, router],
  );

  return (
    <>
      {flow ? (
        <>
          <UserAuthCard
            cardImage="/ory.svg"
            title="Login"
            flowType="login"
            flow={flow}
            additionalProps={{
              loginURL: '/login',
              signupURL: '/registration',
            }}
            includeScripts={true}
            onSubmit={({ body }): void =>
              submitFlow(body as UpdateLoginFlowBody)
            }
          />
          {flow.oauth2_login_challenge && (
            <div>
              <h4>OAuth2 data</h4>
              <p>
                Login challenge: <b>{flow.oauth2_login_challenge}</b>
              </p>
              {flow.oauth2_login_request ? (
                <code>
                  <pre>
                    {JSON.stringify(flow.oauth2_login_request, undefined, 2)}
                  </pre>
                </code>
              ) : (
                <p>No OAuth2 login request data available</p>
              )}
            </div>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

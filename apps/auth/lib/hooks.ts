import { GenericError } from '@ory/client/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { kratos } from './utils';

export interface KratosErrorResponse {
  error: GenericError;
}

// original source: https://github.com/ory/elements/blob/a340041ccdefecd24e860ecdfb47546862b15fc7/examples/nextjs-spa/src/pkg/hooks.tsx#L7-L80
export function HandleError(): (
  err: AxiosError<KratosErrorResponse>,
) => Promise<void> {
  const router = useRouter();

  return useCallback(
    (error: AxiosError<KratosErrorResponse>): Promise<void> => {
      console.log(`HandleError hook: ${JSON.stringify(error.response)}`);

      if (!error.response || error.response?.status === 0) {
        window.location.href = `/error?error=${encodeURIComponent(
          JSON.stringify(error.response),
        )}`;
        return Promise.resolve();
      }

      if (error.response.data?.error) {
        switch (error.response.data?.error.id) {
          case 'session_aal2_required':
            return router
              .push({
                pathname: '/login',
                query: {
                  aal: 'aal2',
                },
              })
              .then(noop);
          case 'session_already_available':
            return router.push('/').then(noop);
          case 'session_refresh_required':
            return router
              .push({
                pathname: '/login',
                query: {
                  refresh: true,
                  returnTo: router.pathname,
                },
              })
              .then(noop);
          case 'self_service_flow_return_to_forbidden':
          case 'self_service_flow_expired':
            return router.push(router.pathname).then(noop);
        }
      }

      switch (error.response?.status) {
        case 400:
          return Promise.reject(error);
        case 404:
          window.location.href = `/error?error=${encodeURIComponent(
            JSON.stringify(error.response),
          )}`;
          return Promise.resolve();
        case 422:
        case 401:
          return Promise.reject(error);
        case 410:
          return router.push(router.pathname).then(noop);
        default:
          return Promise.resolve(router.reload());
      }
    },
    [router],
  );
}

// original source: https://github.com/ory/elements/blob/a340041ccdefecd24e860ecdfb47546862b15fc7/examples/nextjs-spa/src/pkg/hooks.tsx#L83-L112
export function LogoutLink(): () => void {
  const [logoutToken, setLogoutToken] = useState<string | null>(null);
  const [loginRedirect, setLoginRedirect] = useState<boolean>(false);
  const handleError = HandleError();
  const router = useRouter();

  useEffect(() => {
    kratos
      .createBrowserLogoutFlow()
      .then(({ data }) => {
        setLogoutToken(data.logout_token);
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            setLoginRedirect(true);
            return;
        }
      })
      .catch((err: AxiosError<KratosErrorResponse>) => handleError(err));
  }, [handleError]);

  return (): void => {
    if (logoutToken) {
      kratos
        .updateLogoutFlow({ token: logoutToken })
        .then(() => router.push('/login'))
        .then(() => router.reload())
        .catch(console.error);
    } else if (loginRedirect) {
      router.push('/login').catch(console.error);
    }
  };
}

function noop(): void {
  /* no-op */
}

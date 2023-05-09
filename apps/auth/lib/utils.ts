import { OAuth2Api } from '@ory/client';
import { Configuration, FrontendApi } from '@ory/client';
import axios from '@ory/client/node_modules/axios/index';
import { AxiosInstance } from '@ory/client/node_modules/axios/index';

function authError(text: String, redirect: string = '/') {
  console.log(text, redirect);
  //Todo maybe add sentry integration here, but this will also error if it gets queried without cookies
  return {
    redirect: {
      destination: redirect,
      permanent: false,
    },
  };
}

const axios_instance: AxiosInstance = axios.create({ withCredentials: true });

const hydra = new OAuth2Api(
  new Configuration({
    basePath: process.env.ORY_HYDRA_ADMIN_URL,
  }),
  undefined,
  axios_instance,
);

const kratos = new FrontendApi(
  new Configuration({
    basePath: process.env.NEXT_PUBLIC_ORY_KRATOS_PUBLIC_URL,
  }),
  undefined,
  axios_instance,
);

export { authError, hydra, kratos };

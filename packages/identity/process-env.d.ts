namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    APP_ID: string;
    APP_SECRET: string;
    COOKIE_SECRET: string;
    ENDPOINT: string;
    BASE_URL: string;
    MAPI_APP_ID: string;
    MAPI_APP_SECRET: string;
    MAPI_TOKEN_ENDPOINT: string;
    MAPI_RESOURCE_URI: string;
    NEXT_PUBLIC_RESOURCE_AUDIENCE: string;
  }
}

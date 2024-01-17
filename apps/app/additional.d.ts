declare namespace NodeJS {
  interface ProcessEnv {
    RECAPTCHA_SITE_KEY: string;
    RECAPTCHA_SECRET_KEY: string;
    DATABASE_URL: string;
    APP_ID: string;
    APP_SECRET: string;
    ENDPOINT: string;
    BASE_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
    COOKIE_SECRET: string;
    MAPI_APP_ID: string;
    MAPI_APP_SECRET: string;
    MAPI_TOKEN_ENDPOINT: string;
    MAPI_RESOURCE_URI: string;
    NODE_ENV: string;
    NEXT_PUBLIC_JWKS_ENDPOINT: string;
    NEXT_PUBLIC_RESOURCE_AUDIENCE: string;
    NEXT_PUBLIC_ID_ISSUER: string;
  }
}

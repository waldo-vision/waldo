declare namespace NodeJS {
  interface ProcessEnv {
    RECAPTCHA_SITE_KEY: string;
    RECAPTCHA_SECRET_KEY: string;
    DATABASE_URL: string;
    APP_ID: string;
    APP_SECRET: string;
    NEXT_PUBLIC_ENDPOINT: string;
    NEXT_PUBLIC_BASE_URL: string;
    COOKIE_SECRET: string;
    NODE_ENV: string;
    NEXT_PUBLIC_JWKS_ENDPOINT: string;
    NEXT_PUBLIC_ID_ISSUER: string;
    NEXT_PUBLIC_RESOURCE_AUDIENCE: string;
  }
}

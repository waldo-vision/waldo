declare namespace NodeJS {
  interface ProcessEnv {
    RECAPTCHA_SITE_KEY: string;
    RECAPTCHA_SECRET_KEY: string;
    DATABASE_URL: string;
    APP_ID: string;
    APP_SECRET: string;
    ENDPOINT: string;
    BASE_URL: string;
    COOKIE_SECRET: string;
    NODE_ENV: string;
  }
}

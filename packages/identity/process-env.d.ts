namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    APP_ID: string;
    APP_SECRET: string;
    COOKIE_SECRET: string;
    ENDPOINT: string;
    BASE_URL: string;
  }
}

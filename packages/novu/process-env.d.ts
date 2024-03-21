namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    NOVU_API_KEY: string;
    NOVU_BACKEND_URL: string;
    NOVU_WS_URL: string;
    NOVU_APP_ID: string;
  }
}

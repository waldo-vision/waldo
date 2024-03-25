namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    NOVU_API_KEY: string;
    NEXT_PUBLIC_NOVU_BACKEND_URL: string;
    NEXT_PUBLIC_NOVU_WS_URL: string;
    NEXT_PUBLIC_NOVU_APP_ID: string;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_CLIENT_ID: string;
    REDIS_URL: string;
    RATELIMIT_MAX_REQUESTS: number;
    RATELIMIT_DURATION: number;
  }
}
declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_CLIENT_SECRET: string;
    REDIS_URL: string;
  }
}

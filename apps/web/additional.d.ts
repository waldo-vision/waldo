declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_CLIENT_ID: string;
    REDIS_URL: string;
    RATELIMIT_MAX_REQUESTS: number;
    RATELIMIT_DURATION: number;
    YOUTUBE_API_KEY: string;
    CLOUDFLARE_TURNSTILE_SECRET: string;
  }
}
declare namespace NodeJS {
  interface ProcessEnv {
    DISCORD_CLIENT_SECRET: string;
    REDIS_PORT: number;
    RATELIMIT_MAX_REQUESTS: number;
    RATELIMIT_DURATION: number;
    YOUTUBE_API_KEY: string;
    CLOUDFLARE_TURNSTILE_SECRET: string;
  }
}

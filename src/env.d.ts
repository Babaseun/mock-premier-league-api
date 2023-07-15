declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET: Secret;
      DBURI: string;
      NODE_ENV: "test" | "production";
      REDIS_SECRET: string | string[];
      REDIS_PASSWORD: string;
      REDIS_HOST: string;
      REDIS_PORT: number;
      PORT:number
    }
  }
}

export {}
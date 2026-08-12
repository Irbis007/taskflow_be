declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DB_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    API_URL: string;
    CLIENT_URL: string;
  }
}

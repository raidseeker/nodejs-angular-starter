import * as cors from 'cors';

export interface AppConfig {
  ENVIRONMENT: string;
  DB_URI: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
  SSL_CERTIFICATE: {
    KEY: string;
    CERT: string;
    CA: string;
  };
  SOCIAL_CREDENTIALS: {};
  CORS_OPTIONS: cors.CorsOptions;
  LOGS_DIR: string;
  DEBUG_MODE: boolean;
}

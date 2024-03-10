import config from "config";

export enum PrismaErrorCodes {
  UNIQUE_CONSTRAINT_FAILED = "P2002",
  RECORD_NOT_FOUND = "P2025",
}

export enum TokenOptions {
  ACCESS = "access",
  REFRESH = "refresh",
}

export const Config = {
  NODE_ENV: config.get<string>("env"),
  PORT: config.get<number>("port"),
  API_KEY: config.get<string>("apiKey"),
  APP_ID: config.get<string>("appId"),
  BCRYPT_SALT: config.get<number>("bcrypt.salt"),
  ACCESS_TOKEN_EXPIRES_IN: config.get<string>("jwt.accessTokenExpiresIn"),
  REFRESH_TOKEN_EXPIRES_IN: config.get<string>("jwt.refreshTokenExpiresIn"),
  ACCESS_TOKEN_PRIVATE_KEY: config.get<string>("jwt.jwtAccessTokenPrivateKey"),
  ACCESS_TOKEN_PUBLIC_KEY: config.get<string>("jwt.jwtAccessTokenPublicKey"),
  REFRESH_TOKEN_PRIVATE_KEY: config.get<string>(
    "jwt.jwtRefreshTokenPrivateKey",
  ),
  REFRESH_TOKEN_PUBLIC_KEY: config.get<string>("jwt.jwtRefreshTokenPublicKey"),
} as const;

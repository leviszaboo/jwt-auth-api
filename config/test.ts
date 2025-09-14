import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY,
  appId: process.env.APP_ID,
  bcrypt: {
    salt: 10,
  },
  jwt: {
    accessTokenExpiresIn: "5m",
    refreshTokenExpiresIn: "30m",
    jwtAccessTokenPrivateKey: process.env.ACT_PRIVATE_KEY,
    jwtAccessTokenPublicKey: process.env.ACT_PUBLIC_KEY,
    jwtRefreshTokenPrivateKey: process.env.RFT_PRIVATE_KEY,
    jwtRefreshTokenPublicKey: process.env.RFT_PUBLIC_KEY,
  },
};

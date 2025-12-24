import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  corsOrigin: string;
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config: EnvConfig = {
  port: parseInt(getEnvVariable("PORT", "5000"), 10),
  nodeEnv: getEnvVariable("NODE_ENV", "development"),
  mongodbUri: getEnvVariable("MONGODB_URI"),
  jwtSecret: getEnvVariable("JWT_SECRET"),
  jwtExpiresIn: getEnvVariable("JWT_EXPIRES_IN", "7d"),
  corsOrigin: getEnvVariable("CORS_ORIGIN", "http://localhost:3000"),
};

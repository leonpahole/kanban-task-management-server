import { ConfigModuleOptions } from '@nestjs/config';

export interface EnvironmentVariables {
  server: {
    port: number;
    allowedCorsOrigins: string[];
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    databaseName: string;
    logging: string[] | boolean;
    autoRunMigrations: boolean;
  };
  crypto: {
    passwordSaltRounds: number;
  };
  logger: {
    level?: string;
  };
  isProduction: boolean;
  auth: {
    issuerUrl: string;
    audience: string;
  };
}

const commaSeparatedStringToArray = (csstring: string | null | undefined): string[] => {
  if (!csstring?.length) {
    return [];
  }

  return csstring
    .trim()
    .split(',')
    .map((e) => e.trim());
};

const parseDatabaseLoggingEnv = (): string[] | boolean => {
  const logging = commaSeparatedStringToArray(process.env.DATABASE_LOGGING?.trim());
  if (logging.length === 0) {
    return false;
  }

  return logging;
};

const parseAllowedCorsOriginsEnv = (): string[] => {
  return commaSeparatedStringToArray(process.env.ALLOWED_CORS_ORIGINS?.trim());
};

const loadEnvironmentVariables = (): EnvironmentVariables => {
  return {
    server: {
      port: parseInt(process.env.PORT!, 10) || 3000,
      allowedCorsOrigins: parseAllowedCorsOriginsEnv(),
    },
    database: {
      host: process.env.DATABASE_HOST!,
      port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
      databaseName: process.env.DATABASE_NAME!,
      logging: parseDatabaseLoggingEnv(),
      autoRunMigrations: Boolean(Number(process.env.AUTO_RUN_MIGRATIONS)),
    },
    crypto: {
      passwordSaltRounds: parseInt(process.env.BCRYPT_PASSWORD_SALT_ROUNDS!, 10) || 10,
    },
    logger: {
      level: process.env.LOG_LEVEL,
    },
    isProduction: process.env.NODE_ENV === 'production',
    auth: {
      issuerUrl: process.env.AUTH0_ISSUER_URL,
      audience: process.env.AUTH0_AUDIENCE,
    },
  };
};

export const getEnvFilePath = (): string => {
  type NodeEnv = 'test' | 'development';
  const envFilePathMap: Record<NodeEnv, string> = {
    development: '.env.development',
    test: '.env.test',
  };

  const nodeEnv: NodeEnv = (process.env.NODE_ENV as NodeEnv) || 'development';
  return envFilePathMap[nodeEnv];
};

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: getEnvFilePath(),
  load: [loadEnvironmentVariables],
  isGlobal: true,
};

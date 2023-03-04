import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { LoggerOptions } from 'typeorm';
import { EnvironmentVariables } from './environment.config';

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const databaseEnv = configService.get<EnvironmentVariables['database']>('database')!;
    return {
      type: 'postgres',
      host: databaseEnv.host,
      port: databaseEnv.port,
      username: databaseEnv.username,
      password: databaseEnv.password,
      database: databaseEnv.databaseName,
      autoLoadEntities: true,
      synchronize: false,
      logging: databaseEnv.logging as LoggerOptions,
      migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
      migrationsRun: databaseEnv.autoRunMigrations,
    };
  },
};

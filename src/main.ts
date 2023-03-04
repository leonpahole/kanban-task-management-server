import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/environment.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  const serverEnv = app.get(ConfigService).get<EnvironmentVariables['server']>('server')!;
  app.enableCors({ origin: serverEnv.allowedCorsOrigins });

  app.use(helmet());

  const port = app.get(ConfigService).get<number>('server.port')!;
  await app.listen(port);
}

bootstrap().catch((e) => {
  console.error('Error when bootstrapping the server', e);
});

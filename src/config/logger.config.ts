import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModuleAsyncParams } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { EnvironmentVariables } from './environment.config';

export const loggerModuleOptions: LoggerModuleAsyncParams = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const loggerEnv = configService.get<EnvironmentVariables['logger']>('logger')!;
    const isProduction = configService.get<EnvironmentVariables['isProduction']>('isProduction')!;

    const genReqId: any = (req: Request, res: Response): string => {
      if (typeof req.id === 'string') {
        return req.id;
      }

      let id = req.get('X-Request-Id');
      if (id) {
        return id;
      }

      id = randomUUID();
      res.header('X-Request-Id', id);
      return id;
    };

    return {
      pinoHttp: {
        level: loggerEnv.level,
        transport: isProduction ? undefined : { target: 'pino-pretty', options: {} },
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        genReqId,
        enabled: !!loggerEnv.level?.length,
      },
    };
  },
};

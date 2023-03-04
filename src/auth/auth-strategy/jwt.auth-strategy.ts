import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';
import { EnvironmentVariables } from '../../config/environment.config';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${
          configService.get<EnvironmentVariables['auth']>('auth').issuerUrl
        }.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: configService.get<EnvironmentVariables['auth']>('auth').issuerUrl,
      audience: configService.get<EnvironmentVariables['auth']>('auth').audience,

      algorithms: ['RS256'],
    });
  }

  validate(payload: JwtPayloadDto): JwtPayloadDto {
    return payload;
  }
}

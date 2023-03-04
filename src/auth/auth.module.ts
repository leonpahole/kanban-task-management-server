import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthStrategy } from './auth-strategy/jwt.auth-strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtAuthStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  exports: [PassportModule],
})
export class AuthModule {}

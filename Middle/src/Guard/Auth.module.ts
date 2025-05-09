import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/Controller/auth/auth.controller';
import { AuthService } from './AuthService';
import { JwtStrategy } from './JwtStrategy';
import { UsersModule } from './users.module';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'my-secret', // use env var in prod
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

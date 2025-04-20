// src/auth/google-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './AuthService';

@Injectable()
export class GoogleAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ) {}

  // canActivate method checks if the route should be publicly accessible or needs authorization
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();


    // Extract the token from Authorization header (Bearer token)
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Validate the Google token using the AuthService
      const user = await this.authService.verifyGoogleToken(token);
      request.user = user;  // Attach the validated user to the request
      return true;
    } catch (error) {
      // If token verification fails, throw UnauthorizedException
      throw new UnauthorizedException('Invalid token');
    }
  }
}

// src/auth/google-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
      
      // Attach the validated user to the request
      request.user = user;
      
      // Skip database check for all routes
      console.log('Valid Google token for user:', user.email);
      return true;
      
    } catch (error) {
      console.error('Token validation error:', error.message);
      // If token verification fails, throw UnauthorizedException
      throw new UnauthorizedException('Invalid token: ' + error.message);
    }
  }
}

import { Controller, Post, Body, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() body: { email: string; password: string, googleToken: string }) {
    // return this.authService.register(body.email, body.password, body.googleToken);
    try {
      return await this.authService.register(body.email, body.password, body.googleToken);
    } catch (error) {
      console.log("register error",error);
        // return {
        //   statusCode: 409,
        //   message: error || 'Username already exists',
        // };
        throw new ConflictException('Username already exists');
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    console.log("after validate", user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.login(user); // <-- await here
    console.log("login token", token);

    return token;
  }
}
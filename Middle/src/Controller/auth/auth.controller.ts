import { Body, Controller, Get, Headers, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from '../../Guard/AuthService';
import { JwtAuthGuard } from 'src/Guard/jwt-auth.guard';

@Controller('auth-controller')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('me')
    async getMe(@Headers('authorization') authHeader: string) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.split(' ')[1];
        return this.authService.verifyGoogleToken(token);
    }
    
    @Post('login')
    async login(@Req() req) {
        console.log("------------------------------LOGIN--------------------------", req.body);
      return this.authService.login(req.body.token);
    }
    @Post('register')
    async register(@Req() req) {
        console.log("------------------------------Register--------------------------", req.body);
      return this.authService.register(req.body);
    }

  // @Post('loginV2')
  // async loginV2(@Req() req) {
  //   const user = await this.authService.validateUserByUsernamePassword(req.body.username, req.body.password);
  //   if (!user) {
  //     return { error: 'Invalid credentials' };
  //   }
  //   return this.authService.loginWithUserNamePaswword(user);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}

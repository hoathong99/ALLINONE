import { Body, Controller, Get, Headers, Post, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../Guard/AuthService';

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
}

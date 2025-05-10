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

    @Post('register')
    async register(@Req() req) {
        console.log("------------------------------Register--------------------------", req.body);
      return this.authService.register(req.body);
    }

    @Post('authorize')
    async authorize(@Body() body: { access_token: string }) {
        try {
            if (!body.access_token) {
                throw new UnauthorizedException('No access token provided');
            }
            
            // Verify the token and get user info
            const userInfo = await this.authService.verifyGoogleToken(body.access_token);
            
            // Check if user exists in the database
            const isUserInDb = await this.authService.checkUseInDB(userInfo);
            
            return {
                isAuthorized: true,
                userInfo,
                isRegistered: isUserInDb
            };
        } catch (error) {
            return {
                isAuthorized: false,
                error: error.message || 'Invalid or expired token'
            };
        }
    }
}

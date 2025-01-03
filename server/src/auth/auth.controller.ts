import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ summary: 'Sign up' })
    async signUp(@Body('email') email: string, @Body('password') password: string) {
        await this.authService.signUp(email, password);
    }

    @Post('mobile/signin')
    @ApiOperation({ summary: 'Sign in' })
    @HttpCode(200)
    async mobileSignIn(@Body('email') email: string, @Body('password') password: string) {
        return this.authService.signIn(email, password, '30d');
    }

}

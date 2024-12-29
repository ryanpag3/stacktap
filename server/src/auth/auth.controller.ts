import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('signup')
    async signUp(@Body('email') email: string, @Body('password') password: string) {
        await this.authService.signUp(email, password);
    }

    @Post('mobile/signin')
    @HttpCode(200)
    async mobileSignIn(@Body('email') email: string, @Body('password') password: string) {
        return this.authService.signIn(email, password, '30d');
    }

}

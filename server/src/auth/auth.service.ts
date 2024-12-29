import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signUp(email: string, password: string) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return this.usersService.create(email, hashedPassword);
    }

    async signIn(email: string, password: string) {
        const errorMsg = 'Incorrect email or password provided.';
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException(errorMsg);
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password);
        if (!isPasswordMatching) {
            throw new UnauthorizedException(errorMsg);
        }

        // generate JWT
        return {
            access_token: await this.jwtService.signAsync({ sub: user.id })
        }

    }
}

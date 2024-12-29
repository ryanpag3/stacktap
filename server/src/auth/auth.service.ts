import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async signUp(email: string, password: string): Promise<CreateUserDto> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return this.usersService.create(email, hashedPassword);
    }

    async signIn(email: string, password: string, expiresIn: string): Promise<{ access_token: string }> {
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
            access_token: await this.jwtService.signAsync({ sub: user.id }, { expiresIn })
        }

    }
}

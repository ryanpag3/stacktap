import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    id: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;
}
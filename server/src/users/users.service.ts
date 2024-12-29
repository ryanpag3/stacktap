import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async create(email: string, password: string): Promise<CreateUserDto> {
        const user = this.usersRepository.create({ email, password });
        const userEntity = await this.usersRepository.save(user);
        const createUserDto = new CreateUserDto();
        createUserDto.email = userEntity.email;
        createUserDto.id = userEntity.id;
        return createUserDto;
    }

    async findByEmail(email: string): Promise<User> {
        // emails are a unique field, so we can access by index
        const users = await this.usersRepository.find({ where: {
            email
        } });
        return users[0];
    }
}

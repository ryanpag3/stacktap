import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    create(email: string, password: string): Promise<User> {
        const user = this.usersRepository.create({ email, password });
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User> {
        // emails are a unique field, so we can access by index
        const users = await this.usersRepository.find({ where: {
            email
        } });
        return users[0];
    }
}

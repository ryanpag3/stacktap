import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken'

describe('AuthService', () => {
  const testId = '9457aa18-16d8-4dd2-8875-12cc31650f3d';
  const testUserEmail = 'test@test.com';

  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, {
        provide: UsersService,
        useValue: {
          create: jest.fn(() => {
            const createUserDto = new CreateUserDto();
            createUserDto.id = testId;
            createUserDto.email = testUserEmail;
            return createUserDto;
          }),
          findByEmail: jest.fn(async (email: string) => {
            const user = new User();
            user.id = testId;
            user.email = email;
            user.password = await bcrypt.hash('test', 10);
            return user;
          }),
        }
      }, {
        provide: JwtService,
        useValue: {
          signAsync: jest.fn(() => {
            return jwt.sign({ sub: testId }, 'test');
          }),
        }
      }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should be defined', () => {
      expect(service.signUp).toBeDefined();
    });

    it('should return a user object', async () => {
      const result = await service.signUp(testUserEmail, 'test');
      expect(result).toBeDefined();
      expect(result.id).toBe(testId);
      expect(result.email).toBe(testUserEmail);
    });
  });

  describe('signIn', () => {
    it('should be defined', () => {
      expect(service.signIn).toBeDefined();
    });

    it('should return a JWT', async () => {
      const result = await service.signIn(testUserEmail, 'test', '30d');
      expect(result).toHaveProperty('access_token');
    });
  });
});

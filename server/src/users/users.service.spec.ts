import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

const mockUserRepositoryFactory = jest.fn(() => ({
  create: jest.fn(entity => entity),
  save: jest.fn(entity => entity),
  find: jest.fn(({ where: { email }}) => {
    const user = new User();
    user.email = email;
    user.id = 'id';
    user.password = 'password';
    return [user];
  }),
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepositoryFactory
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should return a CreateUserDto', async () => {
      const result = await service.create('test', 'test');
      expect(result).toBeInstanceOf(CreateUserDto);
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('id');
    });
  });

  describe('findByEmail', () => {
    it('should be defined', () => {
      expect(service.findByEmail).toBeDefined();
    });

    it('should return a User', async () => {
      const result = await service.findByEmail('test');
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe('test');
    });
  });
});

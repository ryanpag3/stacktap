import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const jwtService = new JwtService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: {
          signUp: jest.fn(),
          signIn: jest.fn((email: string, password: string, expiresIn: string) => {
            return {
              access_token: jwtService.sign({ sub: randomUUID() }, { expiresIn, secret: 'test' })
            }
          })
        },
      }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should be defined', () => {
      expect(controller.signUp).toBeDefined();
    });

    it('should return undefined', async () => {
      expect(await controller.signUp('test', 'test')).toBeUndefined();
    });
  });

  describe('mobileSignIn', () => {
    it('should be defined', () => {
      expect(controller.mobileSignIn).toBeDefined();
    });

    it('should return an object with an access_token property', async () => {
      expect(await controller.mobileSignIn('test', 'test')).toHaveProperty('access_token');
    });

    it('should return an object with an access_token that is a JWT', async () => {
      const result = await controller.mobileSignIn('test', 'test');
      const jwtService = new JwtService();
      const decoded = jwtService.verify(result.access_token, { secret: 'test' });
      expect(decoded).toHaveProperty('sub');
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
      expect(decoded.sub).toMatch(uuidRegex);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';

describe('AuthController', () => {
    let authController: AuthController;
    let app: INestApplication;
    let mockAuthService: Partial<AuthService>;
    let mockJwtService: Partial<JwtService>;
    let mockUsersService: Partial<UsersService>;

    beforeEach(async () => {
        mockAuthService = {
            validateUser: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
        };

        mockJwtService = {
            sign: jest.fn(),
        };

        mockUsersService = {
            findByRefreshToken: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: UsersService, useValue: mockUsersService },
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        authController = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('login', () => {
        it('should return JWT when credentials are valid', async () => {
            (mockAuthService.validateUser as jest.Mock).mockResolvedValueOnce({ username: 'testuser', id: '123' });
            (mockAuthService.login as jest.Mock).mockResolvedValueOnce({ access_token: 'testToken' });

            const result = await authController.login({ username: 'testuser', password: 'testpassword' });
            expect(result).toEqual({ access_token: 'testToken' });
        });

        it('should throw UnauthorizedException when credentials are invalid', async () => {
            (mockAuthService.validateUser as jest.Mock).mockResolvedValueOnce(null);

            await expect(authController.login({ username: 'testuser', password: 'wrongpassword' }))
                .rejects.toThrow(UnauthorizedException);
        });
    });


    it('/auth/logout (POST) - success', async () => {
        const mockRefreshToken = 'mockValidRefreshToken';


        (mockAuthService.logout as jest.Mock).mockResolvedValue(undefined);

        return request(app.getHttpServer())
            .post('/auth/logout')
            .send({ refreshToken: mockRefreshToken })
            .expect(201)
            .then((res) => {
                expect(res.body).toEqual({ message: 'Logged out successfully' });
            });
    });

    it('/auth/refresh (POST) - success', async () => {
        const mockRefreshToken = 'mockValidRefreshToken';
        const mockAccessToken = 'mockAccessToken';
        const mockUser = { username: 'testuser', id: '123' };

        (mockUsersService.findByRefreshToken as jest.Mock).mockResolvedValueOnce(mockUser);

        (mockJwtService.sign as jest.Mock).mockReturnValueOnce(mockAccessToken);

        return request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refreshToken: mockRefreshToken })
            .expect(201)
            .then((res) => {
                expect(res.body).toEqual({ access_token: mockAccessToken });
            });
    });


    afterAll(async () => {
        await app.close();
    });
});



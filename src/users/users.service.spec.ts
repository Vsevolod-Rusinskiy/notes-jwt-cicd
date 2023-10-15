import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import { getModelToken } from '@nestjs/mongoose';

const mockUser = {
  username: 'testuser',
  password: 'hashedpassword',
  refreshToken: 'sometoken',
};

const mockUserModel = {
  findOne: jest.fn().mockImplementation((param) => {
    if (param.username === 'testuser' || param.refreshToken === 'sometoken') {
      return {
        exec: jest.fn().mockResolvedValue(mockUser),
      };
    } else {
      return {
        exec: jest.fn().mockResolvedValue(null),
      };
    }
  }),
  save: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
  constructor: function (data) {
    this.save = mockUserModel.save;
    Object.assign(this, data);
    return this;
  },
};

const mockUserInstance = {
  ...mockUser,
  save: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      expect(await service.findByUsername('testuser')).toEqual(mockUser);
    });

    it('should return undefined if user not found', async () => {
      expect(await service.findByUsername('unknownuser')).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const user = mockUserInstance;
      expect(await service.updateUser(user as any)).toEqual(mockUser);
      expect(user.save).toHaveBeenCalled();
    });
  });

  describe('findByRefreshToken', () => {
    it('should return a user by refreshToken', async () => {
      expect(await service.findByRefreshToken('sometoken')).toEqual(mockUser);
    });

    it('should return undefined if user not found by refreshToken', async () => {
      expect(await service.findByRefreshToken('unknownToken')).toBeNull();
    });
  });
});

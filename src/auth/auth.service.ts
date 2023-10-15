import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/models/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { BlacklistService } from '../blacklist/blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private blacklistService: BlacklistService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (isPasswordValid) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };

    const refreshToken = uuidv4();

    user.refreshToken = refreshToken;
    await this.usersService.updateUser(user);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async logout(refreshToken: string) {
    const user = await this.usersService.findByRefreshToken(refreshToken);
    if (user) {
      user.refreshToken = null;
      await this.usersService.updateUser(user);
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //  7 дней
      await this.blacklistService.addTokenToBlacklist(refreshToken, expiryDate);
    }
  }
}

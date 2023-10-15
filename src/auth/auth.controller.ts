import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiBody({
    description: 'Provide the refresh token',
    type: 'object',
    required: true,
  })
  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    await this.authService.logout(body.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    description: 'Provide the refresh token to get a new access token',
    type: 'object',
    required: true,
  })
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    const user = await this.usersService.findByRefreshToken(body.refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

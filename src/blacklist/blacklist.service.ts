import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistedToken } from './models/blacklisted-token.schema';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectModel(BlacklistedToken.name)
    private readonly tokenModel: Model<BlacklistedToken>,
  ) {}

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const foundToken = await this.tokenModel.findOne({ token }).exec();
    return !!foundToken;
  }

  async addTokenToBlacklist(token: string, expiryDate: Date): Promise<void> {
    const blacklistedToken = new this.tokenModel({ token, expiryDate });
    await blacklistedToken.save();
  }

  async removeExpiredTokens(): Promise<void> {
    await this.tokenModel
      .deleteMany({ expiryDate: { $lt: new Date() } })
      .exec();
  }
}

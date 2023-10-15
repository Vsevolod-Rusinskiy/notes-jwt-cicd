import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlacklistedToken,
  BlacklistedTokenSchema,
} from './models/blacklisted-token.schema';
import { BlacklistService } from './blacklist.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
    ]),
  ],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}

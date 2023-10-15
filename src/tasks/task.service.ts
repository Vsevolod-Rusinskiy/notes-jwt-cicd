import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlacklistService } from '../blacklist/blacklist.service';

@Injectable()
export class TasksService {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Cron('0 0 * * *') // Это выражение означает "каждый день в полночь"
  async handleCron() {
    await this.blacklistService.removeExpiredTokens();
  }
}

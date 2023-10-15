import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlacklistModule } from '../blacklist/blacklist.module';
import { TasksService } from './task.service';

@Module({
  imports: [ScheduleModule.forRoot(), BlacklistModule],
  providers: [TasksService],
})
export class TasksModule {}

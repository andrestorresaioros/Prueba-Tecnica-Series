import { Module } from '@nestjs/common';
import { DirectorsController } from './directors.controller';
import { DirectorsService } from './directors.service';

@Module({
  controllers: [DirectorsController],
  providers: [DirectorsService],
})
export class DirectorsModule {}

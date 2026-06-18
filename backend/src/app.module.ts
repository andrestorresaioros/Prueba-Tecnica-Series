import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { SeriesModule } from './series/series.module';
import { DirectorsModule } from './directors/directors.module';
import { HealthController } from './health.controller';

@Module({
  imports: [PrismaModule, SeriesModule, DirectorsModule],
  controllers: [HealthController],
})
export class AppModule {}

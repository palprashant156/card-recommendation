import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from './common/prisma.service';
import { CardsModule } from './modules/cards/cards.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { OffersModule } from './modules/offers/offers.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { HistoryModule } from './modules/history/history.module';
import { UsersModule } from './modules/users/users.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    CardsModule,
    MerchantsModule,
    OffersModule,
    RecommendationsModule,
    HistoryModule,
    UsersModule,
    FeedbackModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
  exports: [PrismaService],
})
export class AppModule {}

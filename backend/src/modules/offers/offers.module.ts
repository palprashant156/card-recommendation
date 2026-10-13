import { Module, Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class OffersService {
  constructor(private prisma: PrismaService) {}
  list(merchantId?: string, cardId?: string, status?: string) {
    return this.prisma.offer.findMany({
      where: {
        ...(merchantId ? { merchantId } : {}),
        ...(cardId ? { cardId } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { expiry: 'asc' },
    }).catch(() => []);
  }
}

@ApiTags('offers')
@Controller({ path: 'offers', version: '1' })
export class OffersController {
  constructor(private service: OffersService) {}
  @Get()
  @ApiOperation({ summary: 'List offers with verification status (filter by merchant/card/status)' })
  list(@Query('merchantId') merchantId?: string, @Query('cardId') cardId?: string, @Query('status') status?: string) {
    return this.service.list(merchantId, cardId, status);
  }
}

@Module({ controllers: [OffersController], providers: [OffersService, PrismaService] })
export class OffersModule {}

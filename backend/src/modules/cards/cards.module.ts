import { Module, Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}
  list(q?: string) {
    return this.prisma.cardProduct.findMany({
      where: q ? { OR: [{ issuer: { contains: q, mode: 'insensitive' } }, { product: { contains: q, mode: 'insensitive' } }, { network: { contains: q } }] } : undefined,
      orderBy: [{ popular: 'desc' }, { issuer: 'asc' }],
    }).catch(() => []);
  }
}

@ApiTags('cards')
@Controller({ path: 'cards', version: '1' })
export class CardsController {
  constructor(private service: CardsService) {}
  @Get()
  @ApiOperation({ summary: 'List card catalogue (search by bank/product/network)' })
  @ApiQuery({ name: 'q', required: false })
  list(@Query('q') q?: string) {
    return this.service.list(q);
  }
}

@Module({ controllers: [CardsController], providers: [CardsService, PrismaService] })
export class CardsModule {}

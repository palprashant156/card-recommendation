import { Module, Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.merchant.findMany({ orderBy: { name: 'asc' } }).catch(() => []);
  }
}

@ApiTags('merchants')
@Controller({ path: 'merchants', version: '1' })
export class MerchantsController {
  constructor(private service: MerchantsService) {}
  @Get()
  @ApiOperation({ summary: 'List supported merchants' })
  list() {
    return this.service.list();
  }
}

@Module({ controllers: [MerchantsController], providers: [MerchantsService, PrismaService] })
export class MerchantsModule {}

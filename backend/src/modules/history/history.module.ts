import { Module, Controller, Get, Post, Delete, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PrismaService } from '../../common/prisma.service';

export class CreateHistoryDto {
  @IsString() merchantId!: string;
  @IsString() merchantName!: string;
  @IsNumber() amount!: number;
  @IsString() cardId!: string;
  @IsString() cardLabel!: string;
  @IsNumber() benefit!: number;
  @IsOptional() @IsString() userId?: string;
}

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}
  list(userId?: string) {
    return this.prisma.recommendationHistory.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50,
    }).catch(() => []);
  }
  create(dto: CreateHistoryDto) {
    return this.prisma.recommendationHistory.create({ data: dto }).catch(() => ({ ...dto, id: `local-${Date.now()}`, createdAt: new Date() }));
  }
  remove(id: string) {
    return this.prisma.recommendationHistory.delete({ where: { id } }).catch(() => ({ id, deleted: false }));
  }
}

@ApiTags('history')
@Controller({ path: 'history', version: '1' })
export class HistoryController {
  constructor(private service: HistoryService) {}
  @Get()
  @ApiOperation({ summary: 'List recent recommendation calculations (estimates)' })
  list(@Query('userId') userId?: string) {
    return this.service.list(userId);
  }
  @Post()
  @ApiOperation({ summary: 'Record a recommendation calculation' })
  create(@Body() dto: CreateHistoryDto) {
    return this.service.create(dto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

@Module({ controllers: [HistoryController], providers: [HistoryService, PrismaService] })
export class HistoryModule {}

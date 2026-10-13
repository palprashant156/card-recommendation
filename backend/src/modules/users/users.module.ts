import { Module, Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { IsString, IsArray, IsBoolean, IsOptional } from 'class-validator';
import { PrismaService } from '../../common/prisma.service';

export class UpsertUserDto {
  @IsString() deviceId!: string;
  @IsOptional() @IsArray() cardIds?: string[];
  @IsOptional() @IsBoolean() prime?: boolean;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  get(deviceId: string) {
    return this.prisma.appUser.findUnique({ where: { deviceId } }).catch(() => null);
  }
  upsert(dto: UpsertUserDto) {
    return this.prisma.appUser.upsert({
      where: { deviceId: dto.deviceId },
      create: { deviceId: dto.deviceId, cardIds: dto.cardIds ?? [], prime: dto.prime ?? false },
      update: { ...(dto.cardIds ? { cardIds: dto.cardIds } : {}), ...(dto.prime !== undefined ? { prime: dto.prime } : {}) },
    }).catch(() => ({ deviceId: dto.deviceId, cardIds: dto.cardIds ?? [], prime: dto.prime ?? false }));
  }
}

@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private service: UsersService) {}
  @Get(':deviceId')
  @ApiOperation({ summary: 'Get lightweight device profile (no PII, no card numbers)' })
  get(@Param('deviceId') deviceId: string) {
    return this.service.get(deviceId);
  }
  @Put()
  @ApiOperation({ summary: 'Create/update device profile (cardIds + prime flag only)' })
  upsert(@Body() dto: UpsertUserDto) {
    return this.service.upsert(dto);
  }
}

@Module({ controllers: [UsersController], providers: [UsersService, PrismaService] })
export class UsersModule {}

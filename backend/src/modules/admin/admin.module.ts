import { Module, Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

function requireAdmin(key?: string) {
  if (!key || key !== process.env.ADMIN_API_KEY) throw new UnauthorizedException('Admin key required');
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  async upsertRule(key: string | undefined, rule: Record<string, unknown>) {
    requireAdmin(key);
    const { id, ...rest } = rule as { id: string; [k: string]: unknown };
    const data = rest as Record<string, never>;
    return this.prisma.rewardRule.upsert({
      where: { id },
      create: { id, ...(data as object) } as never,
      update: { ...(data as object), version: { increment: 1 } } as never,
    });
  }
}

@ApiTags('admin')
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private service: AdminService) {}
  @Post('rules/upsert')
  @ApiOperation({ summary: 'Restricted: upsert a versioned reward rule (x-admin-key header)' })
  upsert(@Headers('x-admin-key') key: string, @Body() rule: Record<string, unknown>) {
    return this.service.upsertRule(key, rule);
  }
}

@Module({ controllers: [AdminController], providers: [AdminService, PrismaService] })
export class AdminModule {}

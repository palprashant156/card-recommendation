import { Module, Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';
import { PrismaService } from '../../common/prisma.service';

export class FeedbackDto {
  @IsString() kind!: string;
  @IsString() message!: string;
  @IsOptional() @IsString() contact?: string;
}

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}
  create(dto: FeedbackDto) {
    return this.prisma.feedback.create({ data: dto }).catch(() => ({ ...dto, id: `local-${Date.now()}`, createdAt: new Date() }));
  }
}

@ApiTags('feedback')
@Controller({ path: 'feedback', version: '1' })
export class FeedbackController {
  constructor(private service: FeedbackService) {}
  @Post()
  @ApiOperation({ summary: 'Submit feedback (missing card, wrong rule, etc.)' })
  create(@Body() dto: FeedbackDto) {
    return this.service.create(dto);
  }
}

@Module({ controllers: [FeedbackController], providers: [FeedbackService, PrismaService] })
export class FeedbackModule {}

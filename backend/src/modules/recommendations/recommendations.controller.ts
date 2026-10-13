import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { RecommendDto } from './dto';

@ApiTags('recommendations')
@Controller({ path: 'recommendations', version: '1' })
export class RecommendationsController {
  constructor(private service: RecommendationsService) {}

  @Post()
  @ApiOperation({ summary: 'Recommend best card (deterministic rules engine, estimates only)' })
  recommend(@Body() dto: RecommendDto) {
    return this.service.recommend(dto);
  }
}

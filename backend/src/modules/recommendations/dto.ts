import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecommendDto {
  @ApiProperty({ example: 'amazon' })
  @IsString()
  merchantId!: string;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  @Min(1)
  amount!: number;

  @ApiProperty({ example: ['icici-apay', 'hdfc-millennia'] })
  @IsArray()
  @IsString({ each: true })
  cardIds!: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  hasPrime?: boolean;
}

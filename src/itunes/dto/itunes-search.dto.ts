import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class ItunesSearchDto {
  @IsString()
  term: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  media?: string;

  @IsString()
  @IsOptional()
  entity?: string;

  @IsString()
  @IsOptional()
  attribute?: string;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  lang?: string;

  @IsNumber()
  @IsOptional()
  version?: number;

  @IsBoolean()
  @IsOptional()
  explicit?: string;
}
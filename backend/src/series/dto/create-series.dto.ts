import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SeriesStatus } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateSeriesDto {
  @ApiProperty({ example: 'Breaking Bad' })
  @IsString()
  @Length(2, 120)
  name: string;

  @ApiProperty({ example: '2008-01-20' })
  @IsDateString()
  releaseDate: string;

  @ApiPropertyOptional({ example: 'Un profesor de química entra en el mundo criminal.' })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  synopsis?: string;

  @ApiPropertyOptional({ example: 'Estados Unidos' })
  @IsOptional()
  @IsString()
  @Length(2, 80)
  country?: string;

  @ApiPropertyOptional({ example: 5, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  seasons?: number;

  @ApiPropertyOptional({ example: 9.5, minimum: 0, maximum: 10 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({ enum: SeriesStatus, example: SeriesStatus.FINISHED })
  @IsOptional()
  @IsEnum(SeriesStatus)
  status?: SeriesStatus;

  @ApiProperty({
    description: 'Identificadores de directores asociados a la serie.',
    example: ['clx-director-id-1', 'clx-director-id-2'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  directorIds: string[];
}

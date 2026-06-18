import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateDirectorDto {
  @ApiProperty({ example: 'Vince Gilligan' })
  @IsString()
  @Length(2, 120)
  fullName: string;

  @ApiPropertyOptional({ example: 'Estadounidense' })
  @IsOptional()
  @IsString()
  @Length(2, 80)
  nationality?: string;

  @ApiPropertyOptional({ example: '1967-02-10' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'Director, productor y guionista de televisión.' })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  biography?: string;
}

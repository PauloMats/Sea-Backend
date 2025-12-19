import { IsDateString, IsInt, IsOptional, IsObject, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBiometricDto {
  @IsDateString()
  timestamp: string; // ISO 8601 string vinda do app

  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(220)
  heartRateAvg?: number;

  @IsOptional()
  @IsInt()
  heartRateMax?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stepCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sleepMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  stressLevel?: number;

  @IsOptional()
  @IsObject()
  rawData?: any; // Objeto JSON livre para dados extras do fabricante
}
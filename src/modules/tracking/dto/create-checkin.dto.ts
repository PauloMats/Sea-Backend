import { IsEnum, IsArray, IsString, IsOptional, IsUrl, ArrayMaxSize } from 'class-validator';

// Precisamos replicar o Enum do Prisma aqui para validação
export enum MoodLevel {
  VERY_SAD = 'VERY_SAD',
  SAD = 'SAD',
  NEUTRAL = 'NEUTRAL',
  HAPPY = 'HAPPY',
  VERY_HAPPY = 'VERY_HAPPY',
}

export class CreateCheckinDto {
  @IsEnum(MoodLevel, {
    message: 'Mood must be one of: VERY_SAD, SAD, NEUTRAL, HAPPY, VERY_HAPPY',
  })
  mood: MoodLevel;

  @IsArray()
  @IsString({ each: true }) // Garante que cada item do array é uma string
  @ArrayMaxSize(10) // Limite de segurança para não spamar tags
  tags: string[];

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;
}
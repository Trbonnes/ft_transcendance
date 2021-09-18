import { IsNotEmpty, IsDate, IsNumber } from 'class-validator';

export class TimeoutDto {
  @IsNotEmpty()
  userId: string;
  @IsNumber()
  start: number
  @IsNumber()
  end: number
}

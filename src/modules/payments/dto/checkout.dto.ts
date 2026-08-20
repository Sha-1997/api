import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CheckoutDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsOptional()
  cancelUrl?: string;

 
  @IsString()
  @IsOptional()
  successUrl?: string;
}
import { IsOptional, IsString } from 'class-validator'

export class TransactionRequestDto {
  @IsString()
  transaction: string

  @IsOptional()
  @IsString()
  network?: 'mainnet' | 'testnet' = 'mainnet'
}

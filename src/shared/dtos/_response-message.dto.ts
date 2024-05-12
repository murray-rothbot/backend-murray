import { IsOptional, IsString } from 'class-validator'
export class MessageResponseDto {
  title: string
  description?: string
  color?: number
  fields: {
    [key: string]: {
      description: string
      value: string | GroupedField
    }
  }
}

interface GroupedField {
  [key: string]: {
    description: string
    value: string
  }
}
export class NetworkRequestQueryDto {
  @IsOptional()
  @IsString()
  network?: 'mainnet' | 'testnet' = 'mainnet'
}

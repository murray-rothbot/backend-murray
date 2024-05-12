import { IsString, IsNotEmpty } from 'class-validator'

export class AddressRequestParamsDto {
  @IsNotEmpty()
  @IsString()
  address: string
}

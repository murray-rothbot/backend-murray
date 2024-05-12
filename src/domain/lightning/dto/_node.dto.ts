import { IsString, IsNotEmpty, Length } from 'class-validator'

export class NodeRequestParamsDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 66)
  pubkey: string
}

import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MaxLength(200)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name!: string;

  @IsNotEmpty()
  @MinLength(4)
  password!: string;
}

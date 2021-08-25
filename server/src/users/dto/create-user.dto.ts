import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  displayName: string;

  @IsOptional()
  avatar: string; // link to the image

  @IsOptional()
  twoFactor: boolean = false;

  setEmail(str: string) {
    this.email = str;
    return this;
  }

  setLogin(str: string) {
    this.login = str;
    return this;
  }

  setFirstName(str: string) {
    this.firstName = str;
    return this;
  }

  setDisplayName(str: string) {
    this.displayName = str;
    return this;
  }

  setAvatar(str: string) {
    this.avatar = str;
    return this;
  }

  setTwoFactor(value: boolean) {
    this.twoFactor = value;
    return this;
  }

  // @IsNotEmpty({ message: `isAdministrator boolean required` })
  //isAdministrator: boolean
}

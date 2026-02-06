export class CreateUserResponseDto {
  id: string;
  name: string;
  email: string;
  message: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.message = "User created successfully";
  }
}

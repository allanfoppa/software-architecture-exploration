export interface IUser {
  id?: string;
  name: string;
  email: string;
}

export class User {
  constructor(private props: IUser) {
    if (!props.email.includes("@")) throw new Error("Invalid email");
    if (!props.name) throw new Error("Name is required");
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
}

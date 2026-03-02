/**
 * DOMAIN LAYER - ENTITIES
 *
 * Encapsulates enterprise-wide business rules.
 * This layer is independent of any framework or external concern.
 * It contains the core business logic that should remain stable.
 */

export interface UserProps {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class User {
  private id: string;
  private name: string;
  private email: string;
  private createdAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.createdAt = props.createdAt;
  }

  static create(id: string, name: string, email: string): User {
    return new User({
      id,
      name,
      email,
      createdAt: new Date(),
    });
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  equals(other: User): boolean {
    return this.id === other.id;
  }
}

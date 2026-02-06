import { User } from '../entities/user.entity';

export interface UserRepository {
  getById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

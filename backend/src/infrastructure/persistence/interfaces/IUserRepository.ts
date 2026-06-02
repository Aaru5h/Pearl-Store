import { User } from '../../../domain/identity/User';
import { EmailAddress } from '../../../domain/shared/value-objects/EmailAddress';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: EmailAddress | string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
}

import { User } from './user.entity';
import { UserModel } from '@prisma/client';

export interface IUserRepository {
	create: (user: User) => Promise<UserModel | null>;
	find: (email: string) => Promise<UserModel | null>;
	clear: (email: string) => Promise<void>;
}

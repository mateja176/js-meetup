import { User } from '../models';
import { save } from '../save';

export class UserService {
  constructor(private db: any) {}

  async createUser(user: User): Promise<User> {
    await this.db.exec(
      `INSERT INTO users (id, name, lastname) VALUES ('${user.id}', '${user.name}', '${user.lastname}')`,
    );

    save({ db: this.db, table: 'users' });

    return user;
  }

  async getUserById(userId: string): Promise<User> {
    return await this.db.exec(
      `SELECT TOP 1 * FROM users WHERE id='${userId}'`,
    )[0];
  }

  async getUsers(): Promise<User[]> {
    return await this.db.exec(`SELECT * FROM users`);
  }

  async getParticipantsForNjam(njamId: string): Promise<User[]> {
    return await this.db.exec(
      `SELECT * FROM participants WHERE njamId='${njamId}'`,
    );
  }
}

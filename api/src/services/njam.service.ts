import { v4 as uuid } from 'uuid';
import { Njam, User } from '../models';
import { save } from '../save';

export class NjamService {
  constructor(private db: any) {}

  async getNjams(page: number = 1, pageSize: number = 10): Promise<Njam[]> {
    return await this.db.exec(
      `SELECT * FROM njams OFFSET ${pageSize *
        (page - 1)} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
    );
  }

  async getNjamById(njamId: string): Promise<Njam> {
    return await this.db.exec(
      `SELECT TOP 1 * FROM njams WHERE id='${njamId}'`,
    )[0];
  }

  async createNjam(njam: Njam): Promise<Njam> {
    const users: User[] = await this.db.exec(
      `SELECT * FROM users WHERE id IN (${njam.participants
        .map(p => "'" + p + "'")
        .join(', ')})`,
    );
    if (users.length < njam.participants.length) {
      throw new Error(
        `Could not find either the organizer or one of the participants.`,
      );
    }

    await this.db.exec(
      `INSERT INTO njams (id, location, description, time, ordered, organizer) VALUES ('${njam.id}', '${njam.location}', '${njam.description}', '${njam.time}', ${njam.ordered}, '${njam.organizer}')`,
    );
    njam.participants.forEach(async participant => {
      await this.db.exec(
        `INSERT INTO participants (id, userId, njamId) VALUES ('${uuid()}', '${participant}', '${
          njam.id
        }')`,
      );
    });

    save({ db: this.db, table: 'njams' });
    save({ db: this.db, table: 'participants' });

    return njam;
  }

  async orderNjam(njamId: string): Promise<Njam> {
    await this.db.exec(`UPDATE njams SET ordered=true WHERE id='${njamId}'`);

    save({ db: this.db, table: 'njams' });

    return await this.getNjamById(njamId);
  }

  async deleteNjam(njamId: string): Promise<Njam> {
    const njam: Njam = await this.getNjamById(njamId);
    if (!njam) {
      throw new Error(`Could not find njam with id: ${njamId}`);
    }
    await this.db.exec(`DELETE FROM njams WHERE id='${njamId}'`);
    await this.db.exec(`DELETE FROM participants WHERE njamId='${njamId}'`);

    save({ db: this.db, table: 'njams' });
    save({ db: this.db, table: 'participants' });

    return njam;
  }

  async getMyNjams(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Njam[]> {
    const users: User[] = await this.db.exec(
      `SELECT TOP 1 * FROM users WHERE id='${userId}'`,
    );
    if (users.length === 0) {
      throw new Error(`Could not find user with id: ${userId}`);
    }

    const myNjams: Njam[] = await this.db.exec(
      `SELECT * FROM participants LEFT JOIN njams ON participants.njamId = njams.id WHERE userId='${userId}' OFFSET ${pageSize *
        (page - 1)} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
    );
    return myNjams;
  }

  async joinNjam(userId: string, njamId: string): Promise<Njam> {
    const users: User[] = await this.db.exec(
      `SELECT TOP 1 * FROM users WHERE id='${userId}'`,
    );
    if (users.length === 0) {
      throw new Error(`Could not find user with id: ${userId}`);
    }

    const njam: Njam = await this.getNjamById(njamId);
    if (!njam) {
      throw new Error(`Could not find njam with id: ${njamId}`);
    }

    const participants = this.db.exec(
      `SELECT TOP 1 * FROM participants WHERE userId='${userId}' AND njamId='${njamId}'`,
    );
    if (participants.length > 0) {
      throw new Error(
        `User with id: ${userId} is already a participant in Njam with id: ${njamId}`,
      );
    }

    await this.db.exec(
      `INSERT INTO participants(id, userId, njamId) VALUES ('${uuid()}', '${userId}', '${njamId}')`,
    );

    save({ db: this.db, table: 'njams' });
    save({ db: this.db, table: 'participants' });

    return await this.getNjamById(njamId);
  }

  async leaveNjam(userId: string, njamId: string): Promise<Njam> {
    const users: User[] = await this.db.exec(
      `SELECT TOP 1 * FROM users WHERE id='${userId}'`,
    );
    if (users.length === 0) {
      throw new Error(`Could not find user with id: ${userId}`);
    }

    const njam: Njam = await this.getNjamById(njamId);
    if (!njam) {
      throw new Error(`Could not find njam with id: ${njamId}`);
    }

    await this.db.exec(
      `DELETE FROM participants WHERE userId='${userId}' AND njamId='${njamId}'`,
    );

    save({ db: this.db, table: 'njams' });
    save({ db: this.db, table: 'participants' });

    return await this.getNjamById(njamId);
  }

  async getNjamsCount(): Promise<number> {
    const njams: Njam[] = await this.db.exec(`SELECT id FROM njams`);
    return njams.length;
  }

  async getMyNjamsCount(userId: string): Promise<number> {
    const users: User[] = await this.db.exec(
      `SELECT TOP 1 * FROM users WHERE id='${userId}'`,
    );
    if (users.length === 0) {
      throw new Error(`Could not find user with id: ${userId}`);
    }

    const myNjams: Njam[] = await this.db.exec(
      `SELECT userId FROM participants LEFT JOIN njams ON participants.njamId = njams.id WHERE userId='${userId}'`,
    );
    return myNjams.length;
  }

  async editNjam(njam: Njam): Promise<Njam> {
    let n: Njam = await this.getNjamById(njam.id);
    if (!n) {
      throw new Error(`Could not find njam with id: ${njam.id}`);
    }
    n = Object.assign(n, njam);

    await this.db.exec(
      `UPDATE njams SET location='${n.location}', description='${n.description}', time='${n.time}', ordered=${n.ordered} WHERE id='${n.id}'`,
    );

    save({ db: this.db, table: 'njams' });

    return await this.getNjamById(njam.id);
  }
}

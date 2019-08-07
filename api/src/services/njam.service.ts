import { Njam, User } from "../models";
import { v4 as uuid } from 'uuid';

export class NjamService {
  constructor(private db: any) { }

  async getNjams(): Promise<Njam[]> {
    return await this.db.exec(`SELECT * FROM njams`);
  }

  async getNjamById(njamId: string): Promise<Njam> {
    return await this.db.exec(`SELECT TOP 1 * FROM njams WHERE id='${njamId}'`)[0];
  }

  async createNjam(njam: Njam): Promise<Njam> {
    await this.db.exec(`INSERT INTO njams (id, location, description, time, ordered, organizer) VALUES ('${njam.id}', '${njam.location}', '${njam.description}', '${njam.time}', ${njam.ordered}, '${njam.organizer}')`);
    njam.participants.forEach(async participant => {
      await this.db.exec(`INSERT INTO participants (id, userId, njamId) VALUES ('${uuid()}', '${participant}', '${njam.id}')`);
    });

    return njam;
  }

  async orderNjam(njamId: string): Promise<Njam> {
    await this.db.exec(`UPDATE njams SET ordered=true WHERE id='${njamId}'`);
    return await this.getNjamById(njamId);
  }

  async deleteNjam(njamId: string): Promise<Njam> {
    const njam: Njam = await this.getNjamById(njamId);
    if (!njam) {
      throw new Error(`Could not find njam with id: ${njamId}`);
    }
    await this.db.exec(`DELETE FROM njams WHERE id='${njamId}'`);
    return njam;
  }

  async getMyNjams(userId: string): Promise<Njam[]> {
    const users: User[] = await this.db.exec(`SELECT TOP 1 * FROM users WHERE id='${userId}'`);
    if (users.length === 0) {
      throw new Error(`Could not find user with id: ${userId}`);
    }

    const myNjams: Njam[] = await this.db.exec(`SELECT * FROM participants LEFT JOIN njams ON participants.njamId = njams.id WHERE userId='${userId}'`);
    return myNjams;
  }

  async joinNjam(userId: string, njamId: string): Promise<Njam> {
    const users: User[] = await this.db.exec(`SELECT TOP 1 * FROM users WHERE id='${userId}'`);
    if (users.length === 0) {
      throw new Error(`Could not find user with id: ${userId}`);
    }

    const njam: Njam = await this.getNjamById(njamId);
    if (!njam) {
      throw new Error(`Could not find njam with id: ${njamId}`);
    }

    const participants = this.db.exec(`SELECT TOP 1 * FROM participants WHERE userId='${userId}' AND njamId='${njamId}'`);
    if (participants.length > 0) {
      throw new Error(`User with id: ${userId} is already a participant in Njam with id: ${njamId}`);
    }

    await this.db.exec(`INSERT INTO participants(id, userId, njamId) VALUES ('${uuid()}', '${userId}', '${njamId}')`);
    return await this.getNjamById(njamId);
  }
}
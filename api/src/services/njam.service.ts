import { Njam } from "../models";
import { v4 as uuid } from 'uuid';

export class NjamService {
  constructor(private db: any) { }

  async getNjams(): Promise<Njam[]> {
    return await this.db.exec(`SELECT * FROM njams`);
  }

  async getNjamById(njamId: string): Promise<Njam> {
    return await this.db.exec(`SELECT TOP 1 * FROM njams WHERE id='${njamId}'`)[0];
  }

  async createNjam(njam: Njam) {
    await this.db.exec(`INSERT INTO njams (id, location, description, time, ordered, organizer) VALUES ('${njam.id}', '${njam.location}', '${njam.description}', '${njam.time}', ${njam.ordered}, '${njam.organizer.id}')`);
    njam.participants.forEach(async participant => {
      await this.db.exec(`INSERT INTO participants (id, userId, njamId) VALUES ('${uuid()}', '${participant.id}', '${njam.id}')`);
    });

    return njam;
  }
}
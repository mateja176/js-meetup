import { User, Njam } from './models';
import { v4 as uuid } from 'uuid';

export const Seed = (db: any) => {
  CreateTables(db);

  const user1: User = { id: uuid(), name: 'Milos', lastname: 'Tomsik' };
  const user2: User = { id: uuid(), name: 'Mateja', lastname: 'Petrovic' };
  const user3: User = { id: uuid(), name: 'Igor', lastname: 'Dedic' };
  CreateUser(db, user1);
  CreateUser(db, user2);
  CreateUser(db, user3);

  const njam1: Njam = { id: uuid(), location: 'LaForza', description: "Pica u LF", time: new Date(Date.now()).toUTCString(), ordered: false, organizer: user1, participants: [user1, user2]}
  const njam2: Njam = { id: uuid(), location: 'Fresh', description: "Salata", time: new Date(Date.now()).toUTCString(), ordered: false, organizer: user3, participants: [user1, user3]}
  CreateNjam(db, njam1);
  CreateNjam(db, njam2);
}

function CreateTables(db: any) {
  db.exec("CREATE TABLE users (id STRING PRIMARY KEY, name STRING, lastname STRING)");
  db.exec("CREATE TABLE njams (id STRING PRIMARY KEY, location STRING, description STRING, time STRING, ordered BOOLEAN, organizer STRING FOREIGN KEY REFERENCES users(id))");
  db.exec("CREATE TABLE participants (id STRING PRIMARY KEY, userId STRING FOREIGN KEY REFERENCES users(id), njamId STRING FOREIGN KEY REFERENCES njams(id))");
}

function CreateUser(db: any, user: User) {
  db.exec(`INSERT INTO users (id, name, lastname) VALUES ('${user.id}', '${user.name}', '${user.lastname}')`);
}

function CreateNjam(db: any, njam: Njam) {
  db.exec(`INSERT INTO njams (id, location, description, time, ordered, organizer) VALUES ('${njam.id}', '${njam.location}', '${njam.description}', '${njam.time}', ${njam.ordered}, '${njam.organizer.id}')`);
  njam.participants.forEach(participant => {
    db.exec(`INSERT INTO participants (id, userId, njamId) VALUES ('${uuid()}', '${participant.id}', '${njam.id}')`);
  });
}

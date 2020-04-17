import csvToJson from 'csvtojson';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import { Njam, User } from './models';

export const load = async <Row>({
  db,
  table,
  creator,
}: {
  db: any;
  table: string;
  creator: (db: any, row: Row) => void;
}) => {
  const rows: Row[] = await csvToJson({
    delimiter: ';',
  }).fromFile(join(__dirname, 'db', `${table}.csv`));

  rows.forEach(row => {
    creator(db, row);
  });
};

type RawNjam = Omit<Njam, 'participants'>;

interface RawParticipation {
  id: string;
  userId: string;
  njamId: string;
}

type Participation = Pick<RawParticipation, 'njamId'> & { user: User };

const loadNjams = async (db: any) => {
  const rawNjams: RawNjam[] = await csvToJson({
    delimiter: ';',
  }).fromFile(join(__dirname, 'db', 'njams.csv'));

  const rawParticipation: RawParticipation[] = await csvToJson({
    delimiter: ';',
  }).fromFile(join(__dirname, 'db', 'participants.csv'));

  const participations = rawParticipation.map<Participation>(
    ({ userId, ...participation }) => ({
      ...participation,
      user: db.exec(`SELECT * FROM users WHERE id='${userId}'`)[0],
    }),
  );

  const njams = rawNjams.map<Njam>(({ organizer, ...njam }) => ({
    ...njam,
    organizer: db.exec(`SELECT * FROM users WHERE id='${organizer}'`)[0],
    participants: participations.reduce(
      (participants, { user, njamId }) =>
        participants.concat(njamId === njam.id ? user : []),
      [],
    ),
  }));

  njams.forEach(njam => {
    CreateNjam(db, njam);
  });
};

export const Seed = (db: any) => {
  CreateTables(db);

  load({ db, table: 'users', creator: CreateUser });

  loadNjams(db);
};

function CreateTables(db: any) {
  db.exec(
    'CREATE TABLE users (id STRING PRIMARY KEY, name STRING, lastname STRING)',
  );
  db.exec(
    'CREATE TABLE njams (id STRING PRIMARY KEY, location STRING, description STRING, time STRING, ordered BOOLEAN, organizer STRING FOREIGN KEY REFERENCES users(id))',
  );
  db.exec(
    'CREATE TABLE participants (id STRING PRIMARY KEY, userId STRING FOREIGN KEY REFERENCES users(id), njamId STRING FOREIGN KEY REFERENCES njams(id))',
  );
}

function CreateUser(db: any, user: User) {
  db.exec(
    `INSERT INTO users (id, name, lastname) VALUES ('${user.id}', '${user.name}', '${user.lastname}')`,
  );
}

function CreateNjam(db: any, njam: Njam) {
  db.exec(
    `INSERT INTO njams (id, location, description, time, ordered, organizer) VALUES ('${njam.id}', '${njam.location}', '${njam.description}', '${njam.time}', ${njam.ordered}, '${njam.organizer.id}')`,
  );
  njam.participants.forEach(participant => {
    db.exec(
      `INSERT INTO participants (id, userId, njamId) VALUES ('${uuid()}', '${
        participant.id
      }', '${njam.id}')`,
    );
  });
}

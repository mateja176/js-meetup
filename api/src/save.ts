import { join } from 'path';

export const save = ({ db, table }: { db: any; table: string }) => {
  const rows = db.exec(`SELECT * FROM ${table}`);
  db.exec(
    `SELECT * INTO CSV("${join(__dirname, 'db', `${table}.csv`)}") FROM ?`,
    [rows],
  );
};

export const saveAll = (db: any) => {
  save({ db, table: 'users' });
  save({ db, table: 'njams' });
  save({ db, table: 'participants' });
};

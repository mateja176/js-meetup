export const Seed = (db: any) => {
    db.exec("CREATE TABLE users (id STRING PRIMARY KEY, name STRING, lastname STRING)");
    db.exec("CREATE TABLE events (id STRING PRIMARY KEY, name STRING)");
    db.exec("CREATE TABLE users_events (id STRING PRIMARY KEY, userId STRING FOREIGN KEY REFERENCES users(id), eventId STRING FOREIGN KEY REFERENCES events(id))");
}

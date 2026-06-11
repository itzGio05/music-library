-- Turn on foreign key support (SQLite has it off by default)
PRAGMA foreign_keys = ON;

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    name              TEXT    NOT NULL,
    genre             TEXT,
    monthly_listeners INTEGER
);

-- Albums belong to an artist
-- ON DELETE CASCADE means deleting an artist also deletes their albums
CREATE TABLE IF NOT EXISTS albums (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    release_year INTEGER,
    listens      INTEGER DEFAULT 0,
    artist_id    INTEGER NOT NULL,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Songs belong to an album
-- ON DELETE CASCADE means deleting an album also deletes its songs
CREATE TABLE IF NOT EXISTS songs (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    release_year INTEGER,
    album_id     INTEGER NOT NULL,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

-- Seed data: 2 artists
INSERT OR IGNORE INTO artists (id, name, genre, monthly_listeners) VALUES
(1, 'Arctic Monkeys', 'Indie Rock', 22000000),
(2, 'Kendrick Lamar', 'Hip-Hop',    45000000);

-- Seed data: 5 albums
INSERT OR IGNORE INTO albums (id, name, release_year, listens, artist_id) VALUES
(1, 'Whatever People Say I Am',  2006, 300000000, 1),
(2, 'AM',                        2013, 800000000, 1),
(3, 'Tranquility Base Hotel',    2018, 200000000, 1),
(4, 'good kid, m.A.A.d city',    2012, 900000000, 2),
(5, 'To Pimp a Butterfly',       2015, 700000000, 2);

-- Seed data: 10 songs
INSERT OR IGNORE INTO songs (id, name, release_year, album_id) VALUES
(1,  'R U Mine?',              2013, 2),
(2,  'Do I Wanna Know?',       2013, 2),
(3,  'Why d You Only Call Me', 2013, 2),
(4,  'I Wanna Be Yours',       2013, 2),
(5,  'Dancing Shoes',          2006, 1),
(6,  'I Bet You Look Good',    2006, 1),
(7,  'Alright',                2015, 5),
(8,  'King Kunta',             2015, 5),
(9,  'Money Trees',            2012, 4),
(10, 'Backseat Freestyle',     2012, 4);

const { getDb, save, toRows } = require('../db');

function getAll(req, res) {
    // join with albums and artists to get their names
    const rows = toRows(getDb().exec(`
        SELECT songs.*, albums.name AS album_name, artists.name AS artist_name
        FROM songs
        JOIN albums ON songs.album_id = albums.id
        JOIN artists ON albums.artist_id = artists.id
    `));
    res.json(rows);
}

function getOne(req, res) {
    const rows = toRows(getDb().exec(
        `SELECT songs.*, albums.name AS album_name, artists.name AS artist_name
         FROM songs
         JOIN albums ON songs.album_id = albums.id
         JOIN artists ON albums.artist_id = artists.id
         WHERE songs.id = :id`,
        { ':id': req.params.id }
    ));
    if (!rows.length) return res.status(404).json({ error: 'Song not found' });
    res.json(rows[0]);
}

function create(req, res) {
    const { name, release_year, album_id } = req.body;
    if (!name || !album_id) return res.status(400).json({ error: 'Name and album_id are required' });

    getDb().run(
        'INSERT INTO songs (name, release_year, album_id) VALUES (:name, :year, :album)',
        { ':name': name, ':year': release_year || null, ':album': album_id }
    );

    const id = toRows(getDb().exec('SELECT last_insert_rowid() AS id'))[0].id;
    save();
    res.status(201).json({ message: 'Song created', id });
}

function update(req, res) {
    const { name, release_year } = req.body;
    const rows = toRows(getDb().exec('SELECT * FROM songs WHERE id = :id', { ':id': req.params.id }));
    if (!rows.length) return res.status(404).json({ error: 'Song not found' });

    const cur = rows[0];
    getDb().run(
        'UPDATE songs SET name = :name, release_year = :year WHERE id = :id',
        { ':name': name ?? cur.name, ':year': release_year ?? cur.release_year, ':id': req.params.id }
    );
    save();
    res.json({ message: 'Song updated' });
}

function remove(req, res) {
    const rows = toRows(getDb().exec('SELECT id FROM songs WHERE id = :id', { ':id': req.params.id }));
    if (!rows.length) return res.status(404).json({ error: 'Song not found' });

    getDb().run('DELETE FROM songs WHERE id = :id', { ':id': req.params.id });
    save();
    res.json({ message: 'Song deleted' });
}

module.exports = { getAll, getOne, create, update, remove };

const { getDb, save, toRows } = require('../db');

function getAll(req, res) {
    // join with artists to get the artist name
    const rows = toRows(getDb().exec(`
        SELECT albums.*, artists.name AS artist_name
        FROM albums JOIN artists ON albums.artist_id = artists.id
    `));
    res.json(rows);
}

function getOne(req, res) {
    const rows = toRows(getDb().exec(
        `SELECT albums.*, artists.name AS artist_name
         FROM albums JOIN artists ON albums.artist_id = artists.id
         WHERE albums.id = :id`,
        { ':id': req.params.id }
    ));
    if (!rows.length) return res.status(404).json({ error: 'Album not found' });
    res.json(rows[0]);
}

function create(req, res) {
    const { name, release_year, listens, artist_id } = req.body;
    if (!name || !artist_id) return res.status(400).json({ error: 'Name and artist_id are required' });

    getDb().run(
        'INSERT INTO albums (name, release_year, listens, artist_id) VALUES (:name, :year, :listens, :artist)',
        { ':name': name, ':year': release_year || null, ':listens': listens || 0, ':artist': artist_id }
    );

    const id = toRows(getDb().exec('SELECT last_insert_rowid() AS id'))[0].id;
    save();
    res.status(201).json({ message: 'Album created', id });
}

function update(req, res) {
    const { name, release_year, listens } = req.body;
    const rows = toRows(getDb().exec('SELECT * FROM albums WHERE id = :id', { ':id': req.params.id }));
    if (!rows.length) return res.status(404).json({ error: 'Album not found' });

    const cur = rows[0];
    getDb().run(
        'UPDATE albums SET name = :name, release_year = :year, listens = :listens WHERE id = :id',
        { ':name': name ?? cur.name, ':year': release_year ?? cur.release_year, ':listens': listens ?? cur.listens, ':id': req.params.id }
    );
    save();
    res.json({ message: 'Album updated' });
}

function remove(req, res) {
    const rows = toRows(getDb().exec('SELECT id FROM albums WHERE id = :id', { ':id': req.params.id }));
    if (!rows.length) return res.status(404).json({ error: 'Album not found' });

    getDb().run('DELETE FROM albums WHERE id = :id', { ':id': req.params.id });
    save();
    res.json({ message: 'Album deleted' });
}

module.exports = { getAll, getOne, create, update, remove };
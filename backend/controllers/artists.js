
const { getDb, save, toRows } = require('../db');

function getAll(req, res) {
    const rows = toRows(getDb().exec('SELECT * FROM artists'));
    res.json(rows);
}

function getOne(req, res) {
    const rows = toRows(getDb().exec('SELECT * FROM artists WHERE id = :id', { ':id': req.params.id }));
    if (!rows.length) return res.status(404).json({ error: 'Artist not found' });
    res.json(rows[0]);
}

function create(req, res) {
    const { name, genre, monthly_listeners } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    getDb().run(
        'INSERT INTO artists (name, genre, monthly_listeners) VALUES (:name, :genre, :ml)',
        { ':name': name, ':genre': genre || null, ':ml': monthly_listeners || null }
    );

    const id = toRows(getDb().exec('SELECT last_insert_rowid() AS id'))[0].id;
    save();
    res.status(201).json({ message: 'Artist created', id });
}

function update(req, res) {
    const { name, genre, monthly_listeners } = req.body;
    const rows = toRows(getDb().exec('SELECT * FROM artists WHERE id = :id', { ':id': req.params.id }));
    if (!rows.length) return res.status(404).json({ error: 'Artist not found' });

    const cur = rows[0];
    getDb().run(
        'UPDATE artists SET name = :name, genre = :genre, monthly_listeners = :ml WHERE id = :id',
        { ':name': name ?? cur.name, ':genre': genre ?? cur.genre, ':ml': monthly_listeners ?? cur.monthly_listeners, ':id': req.params.id }
    );
    save();
    res.json({ message: 'Artist updated' });
}

function remove(req, res) {
    const rows = toRows(getDb().exec('SELECT id FROM artists WHERE id = :id', { ':id': req.params.id }));
    if (!rows.length) return res.status(404).json({ error: 'Artist not found' });

    getDb().run('DELETE FROM artists WHERE id = :id', { ':id': req.params.id });
    save();
    res.json({ message: 'Artist deleted' });
}

module.exports = { getAll, getOne, create, update, remove };

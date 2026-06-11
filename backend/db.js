const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'app.db');
const SQL_PATH = path.join(__dirname, 'model.sql');

let db;

// write the db to disk so data doesnt disappear on restart
function save() {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

async function init() {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
        db = new SQL.Database(fs.readFileSync(DB_PATH));
    } else {
        // first time running - create tables and add seed data
        db = new SQL.Database();
        db.run(fs.readFileSync(SQL_PATH, 'utf8'));
        save();
    }
}

// sql.js returns data in a weird format, this just converts it to normal objects
function toRows(results) {
    if (!results.length) return [];
    const { columns, values } = results[0];
    return values.map(row => {
        const obj = {};
        columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
    });
}

module.exports = { init, save, toRows, getDb: () => db };
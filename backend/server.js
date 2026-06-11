const express = require('express');
const cors = require('cors');
const { init } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// routes for each resource
app.use('/artists', require('./routes/artists'));
app.use('/albums', require('./routes/albums'));
app.use('/songs', require('./routes/songs'));

// start server after db is ready
(async () => {
    await init();
    app.listen(5000, () => console.log('running on port 5000'));
})();
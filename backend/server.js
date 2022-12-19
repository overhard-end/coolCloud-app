const express = require('express');
const app = express();
const port = 4000;
var cors = require('cors');
const router = require('./router/router');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api', router);
app.listen(port, () => console.log('Server has been started on port:', port));

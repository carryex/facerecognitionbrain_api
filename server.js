const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  version: '14.0',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'teuzswk5035tua15e',
    database: 'smart-brain'
  }
})


const app = express();
app.use(express.json())
app.use(cors());

const secret = 'super secret';
const hash = (str) => crypto.createHmac('sha256', secret).update(str).digest('hex');
app.get('/', (req, res) => res.status(200).json('Hello world'))
app.post('/signin', signin.handleSignIn(db, hash))
app.post('/register', register.handleRegister(db, hash));
app.get('/profile/:id', profile.handleProfileGet(db));
app.put('/image', image.handleImage(db))
app.post('/image', image.handleApiCall)
app.listen(process.env.PORT || 3000, () => console.log(`Server started on port ${process.env.PORT}`))


const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  version: '14.0',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: '{databaseUserName}',
    password: '{databaseUserPassword}',
    database: '{databaseName}'
  }
})


const app = express();
app.use(express.json())
app.use(cors());

const hash = (str) => crypto.createHmac('sha256', secret).update(str).digest('hex');

const secret = 'super secret';

app.get('/', (req, res) => {
  res.send('It is working')
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    db('login')
      .select('email', 'hash')
      .where('email', email)
      .then(data => {
        data.length && data[0].hash === hash(password) ?
          db('users').where('email', email).then(user => res.json(user[0])).catch(err => res.status(400).status('unable to get user')) :
          res.status(400).json('wrong credentials')

      })
      .catch(err => res.status(400).json('wrong credentials'))
  }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    const hashedPassword = hash(password);
    const joined = new Date();
    db.transaction(trx => {
      trx
        .insert({
          hash: hashedPassword,
          email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name,
              joined,
            })
            .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
      .catch(err => res.status(400).json('Unable to register'))
  } else {
    res.status(400).json('Invalid arguments')
  }
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db('users')
    // .select('*')
    // .from('users')
    .where('id', id)
    .then(user => user.length ? res.json(user[0]) : res.status(404).json('Specified user not found'))
    .catch(err => res.status(400).json('Internal error'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
  console.log("Server started on port 3000")
})


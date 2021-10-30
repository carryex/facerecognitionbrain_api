const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors());

const hash = (str) => crypto.createHmac('sha256', secret).update(str).digest('hex');

const secret = 'super secret';

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'b42548e2db3492eac197044ed36c8031e120da40c4ab9413ff081090470a0863',
      entries: 0,
      joined: new Date(),
    }
  ]
}

app.get('/', (req, res) => {
  res.send('It is working')
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const user = database.users.find(user => user.email === email && hash(password) === user.password);
  if (user) {
    const userResponseObject = { ...user };
    delete userResponseObject.password;
    res.json(userResponseObject);
  } else {
    res.status(400).json('error loggin in')
  }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (name && email && password) {
    const hashedPassword = hash(password);
    const now = new Date();
    const user = {
      name,
      email,
      password: hashedPassword,
      id: now.getTime(),
      joined: now,
      entries: 0,
    }
    database.users.push(user)
    const userResponseObject = { ...user };
    delete userResponseObject.password;
    res.json(userResponseObject);
  } else {
    res.status(400).json('error register')
  }
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const user = database.users.find(user => user.id === id)
  if (user) {
    const userResponseObject = { ...user };
    delete userResponseObject.password;
    res.json(userResponseObject);
  } else {
    res.status(404).json('User not found')
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  const user = database.users.find(user => user.id === id)
  if (user) {
    user.entries++;
    res.json(user.entries);
  } else {
    res.status(404).json('User not found')
  }
})

app.listen(3000, () => {
  console.log("Server started on port 3000")
})


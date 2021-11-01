const handleSignIn = (db, hash) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('wrong credentials')
  }
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

module.exports = {
  handleSignIn
}
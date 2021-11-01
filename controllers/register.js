const handleRegister = (db, hash) => (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json('Invalid arguments');
  }
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

}

module.exports = {
  handleRegister
}
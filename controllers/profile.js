const handleProfileGet = (db) => (req, res) => {
  const { id } = req.params;
  db('users')
    .where('id', id)
    .then(user => user.length ? res.json(user[0]) : res.status(404).json('Specified user not found'))
    .catch(err => res.status(400).json('Internal error'))
}

module.exports = {
  handleProfileGet
}
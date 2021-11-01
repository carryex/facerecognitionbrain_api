const clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'ef9d527e302f441bb70d06f4eae84db4'
});

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'))
}

const handleApiCall = (req, res) => {
  const { image } = req.body;
  if (!image) {
    return res.status(400).json('Invalid specified image')
  }
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, image)
    .then(response => res.json(response))
    .catch(err => res.status(400).json('Unbale to worl with API'))
}

module.exports = {
  handleImage,
  handleApiCall
}
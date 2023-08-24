const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User } = require('../models')

const userController = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        const { file } = req
        return Promise.all([
          bcrypt.hash(req.body.password, 10),
          imgurFileHandler(file)
        ])
      })
      .then(([hash, filePath]) => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        image: filePath || null
      }))
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  }
}
module.exports = userController

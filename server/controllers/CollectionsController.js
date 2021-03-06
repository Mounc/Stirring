const Collection = require('../models/collection')
const User = require('../models/user')

const Controller = {
  delete: (req, res) => {
    const { collection } = req.body

    const subtractOnUser = collection => {
      if (!collection) {
        throw new Error('delete Error')
      } else {
        return User.deleteCollection(collection)
      }
    }

    const respond = collection => {
      res.json({ success: true, collection })
    }

    const onError = error => {
      res.json({ message: error.message })
    }

    Collection.deleteOne(collection)
      .then(subtractOnUser)
      .then(respond)
      .catch(onError)
  },

  update: (req, res) => {
    const { collection } = req.body

    const respond = collection => {
      res.json({ success: true, collection })
    }

    const onError = error => {
      res.json({ message: error.message })
    }

    Collection.updateOne(collection)
      .then(respond)
      .catch(onError)
  },

  subtractPost: (req, res) => {
    const findUpdated = collection => {
      if (!collection) {
        throw new Error('Failed to add post into Collection.')
      } else {
        return Collection.findByAuthor(collection.author)
      }
    }

    const respond = collections => {
      res.json({ success: true, collections })
    }

    const onError = error => {
      res.json({ message: error.message })
    }

    Collection.findOneSubtractPost(req.body.collection, req.body.post)
      .then(findUpdated)
      .then(respond)
      .catch(onError)
  },

  addPost: (req, res) => {
    const findUpdated = collection => {
      if (!collection) {
        throw new Error('Failed to add post into Collection.')
      } else {
        return Collection.findByAuthor(collection.author)
      }
    }

    const respond = collections => {
      res.json({ success: true, collections })
    }

    const onError = error => {
      res.json({ message: error.message })
    }

    Collection.findOneAddPost(req.body.collection, req.body.post)
      .then(findUpdated)
      .then(respond)
      .catch(onError)
  },

  getByAuthor: (req, res) => {
    var { author, count } = req.query
    count = JSON.parse(count)

    const find = author => {
      if (author) return Collection.findByAuthor(author, count)
      else return Collection.findAll(count)
    }

    const respond = collections => {
      res.json({ success: true, collections })
    }

    const onError = error => {
      res.json({ message: error.message })
    }

    find(author)
      .then(respond)
      .catch(onError)
  },

  getByIds: (req, res) => {
    var { mode, count } = req.query
    if (count) count = JSON.parse(count)
    let { ids } = req.params
    ids = ids.split(',')

    const find = mode => {
      if (mode === 'id') return Collection.findByIds(ids, count)
      else if (mode === 'word') return Collection.findByWords(ids, count)
    }

    const respond = collections => {
      res.json({ success: true, collections })
    }

    const onError = error => {
      res.json({ message: error.message })
    }
    find(mode)
      // Collection.findByIds(ids)
      .then(respond)
      .catch(onError)
  },

  createCollection: (req, res) => {
    const { title, author } = req.body

    const createOnUser = collection => {
      if (!collection) {
        throw new Error('createCollectionError3')
      } else {
        return User.createCollection(collection)
      }
    }

    const getUpdatedUser = user => {
      if (!user) throw new Error('createCollectionError4')
      else {
        return User.findById(user._id)
      }
    }

    const respond = user => {
      if (user.length === 1) user = user[0]
      res.json({
        success: true,
        user
      })
    }

    const onError = error => {
      res.json({ message: error.message })
    }

    Collection.create(title, author)
      .then(createOnUser)
      .then(getUpdatedUser)
      .then(respond)
      .catch(onError)
  }
}

module.exports = Controller

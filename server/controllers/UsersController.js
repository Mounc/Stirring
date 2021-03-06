const User = require('../models/user')
const Post = require('../models/post')
const Collection = require('../models/collection')
const fs = require('fs')
const ResetPassword = require('../services/user/ResetPassword')

module.exports = {
  update: (req, res) => {
    const { id } = req.params
    const user = req.body

    const respond = () => {
      res.json({ success: true })
    }

    const onError = error => {
      res.json({
        message: error.message
      })
    }

    User.update(id, user)
      .then(respond)
      .catch(onError)
  },

  signup: (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    }

    const create = user => {
      if (user) {
        throw new Error('signupError')
      } else {
        return User.create(newUser)
      }
    }

    const respond = () => {
      res.json({
        success: true,
        message: 'signupSuccess'
      })
    }

    const onError = error => {
      res.json({
        message: error.message
      })
    }

    User.findOneByEmail(newUser.email)
      .then(create)
      .then(respond)
      .catch(onError)
  },

  getUser: (req, res) => {
    var { mode, count } = req.query
    count = JSON.parse(count)

    const find = mode => {
      let { id } = req.params
      id = id.split(',')
      if (mode === 'id') return User.findById(id, count)
      else if (mode === 'word') return User.findByWord(id, count)
    }

    const respond = user => {
      res.json({
        success: true,
        user
      })
    }

    const onError = error => {
      res.json({ message: error.message })
    }
    find(mode)
      .then(respond)
      .catch(onError)
  },

  getAllUsers: (req, res) => {
    var { count } = req.query
    count = JSON.parse(count)

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

    User.findAll(count)
      .then(respond)
      .catch(onError)
  },

  getUserProfileImage: (req, res) => {
    const { id } = req.params

    const respond = image => {
      res.json({
        success: true,
        image: image.image
      })
    }

    const onError = error => {
      res.json({ message: error.message })
    }

    User.findOneProfileImageById(id)
      .then(respond)
      .catch(onError)
  },

  setUserProfileImage: (req, res) => {
    const { filename } = req.files.img[0]
    const { userId } = req.body

    const set = (userId, filename) => {
      return User.updateProfileImageById(userId, filename)
    }

    const deleteOldImageFile = user => {
      return new Promise((resolve, reject) => {
        if (user.image == 'face-default.png') {
          resolve(user)
          return
        }
        fs.unlink('./server/uploads/profile-images/' + user.image, function(
          err
        ) {
          if (err) {
            console.log(err)
            reject(err)
            return
          }
          resolve(user)
        })
      })
    }

    const respond = user => {
      res.json({
        success: true,
        user
      })
    }

    const onError = error => {
      res.json({ message: error.message })
    }

    set(userId, filename)
      .then(deleteOldImageFile)
      .then(respond)
      .catch(onError)
  },

  changePassword: (req, res) => {
    const { id } = req.params
    const { oldPassword, newPassword } = req.body

    const verify = user => {
      if (!user) throw new Error('User does not exist')
      else if (user.verify(oldPassword))
        return User.updatePassword(id, newPassword)
    }

    const respond = () => {
      res.json({ success: true })
    }

    const onError = err => {
      res.json({ message: err.message })
    }

    User.findOneByIdWithPW(id)
      .then(verify)
      .then(respond)
      .catch(onError)
  },

  deleteAccount: (req, res) => {
    const { email } = req.params
    const { password } = req.body
    var account = null

    const verify = user => {
      account = user
      if (!user) throw new Error('User does not exist')
      else if (user.verify(password)) return User.deleteOneByEmail(email)
    }

    const deleteOldImageFile = user => {
      return new Promise((resolve, reject) => {
        if (user.image == 'face-default.png') {
          resolve(user)
          return
        }
        fs.unlink('./server/uploads/profile-images/' + account.image, function(
          err
        ) {
          if (err) {
            console.log(err)
            reject(err)
            return
          }
          resolve(user)
        })
      })
    }

    const deleteFiles = () => {
      Post.findByAuthorId(account._id).then(posts => {
        posts.forEach(post => {
          fs.unlink('./server/uploads/posts/' + post.data.filename, err => {
            if (err) {
              console.log(err)
              return Promise.reject(err)
            }
          })
        })
        return Promise.resolve()
      })
    }

    const deletePosts = () => {
      return Post.deleteByAuthorId(account._id)
    }

    const subtractFF = () => {
      return User.subtractFF(account.followings, account.followers, account._id)
    }

    const deleteCollections = () => {
      return Collection.deleteCollections(account.collections)
    }

    const decreaseLikes = () => {
      return Post.decLikes(account.likes)
    }

    const respond = () => {
      res.json({ success: true })
    }

    const onError = err => {
      res.json({ message: err.message })
    }

    User.findOneByEmail(email)
      .then(verify)
      // 프로필 이미지 파일 삭제
      .then(deleteOldImageFile)
      // account.posts에 해당하는 post 삭제, post.data.filename 파일 삭제
      .then(deleteFiles)
      .then(deletePosts)
      // account.followings에 해당하는 user의 followers에서 _id 를삭제
      // account.followers 해당하는 user의 followings에 _id 를삭제
      .then(subtractFF)
      // collections 에 해당하는 collection 삭제
      .then(deleteCollections)
      // likes 에 해당하는 post.likes 1 감소
      .then(decreaseLikes)
      .then(respond)
      .catch(onError)
  },

  checkEmail: (req, res) => {
    const { email } = req.params

    const requestReset = user => {
      if (!user || email != user.email)
        throw new Error('This email is not registerd')
      return ResetPassword.request(email, user.name)
    }

    const respond = payload => {
      res.json({ success: true, email: payload.email })
    }

    const onError = err => {
      console.log(err)
      res.json({ message: err.message })
    }

    User.findOneByEmail(email)
      .then(requestReset)
      .then(respond)
      .catch(onError)
  },

  resetPassword: (req, res) => {
    const { newPassword, token } = req.body

    const respond = () => {
      res.json({ success: true })
    }

    const onError = err => {
      console.log(err)
      res.json({ message: err.message })
    }

    ResetPassword.checkAndSubmit({ newPassword, token })
      .then(({ email, newPassword }) => {
        return User.updatePasswordByEmail({ email, newPassword })
      })
      .then(respond)
      .catch(onError)
  },

  updateInterests: (req, res) => {
    const { userId } = req.params
    const interests = req.body.interests.map(item => item.toUpperCase())

    const respond = () => {
      res.json({ success: true })
    }

    const onError = err => {
      res.json({ message: err.message })
    }

    User.updateInterests(userId, interests)
      .then(respond)
      .catch(onError)
  }
}

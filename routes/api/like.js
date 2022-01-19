//@ts-check

const express = require('express')
const router = express.Router();
const models = require('../../models')
const checkAuth = require('../../checkAuth')

router.get('/', (req, res, next) => {
  models.Like.findAll()
    .then(likes => {
      res.json(likes)
    })
    .catch(e => {
      console.error(e)
      res.status(500).json({
        error: 'Server Error'
      })
    })
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  models.Like.findByPk(id)
    .then((like) => {
      if (like) {
        // if there is any data, send it back as JSON
        res.json(like)
      } else {
        // if there isn't, send a 404 status code with and error as JSON
        res.status(404).json({
          error: `Could not find member with that id`
        })
      }
    })
    .catch(e => {
      // if there are any errors, log them to the server console
      console.error(e)
        // and send a 500 error response
      res.status(500).json({
        error: 'Server Error'
      })
    })
})

router.post('/:blogId/posts', checkAuth, (req, res) => {
  if (!req.body.text) {
    res.status(400).json({
      error: 'Please include all required fields'
    })
    return
  }
  models.Blog.findByPk(req.params.blogId)
    .then(blog => {
      if (!blog) {
        res.status(404).json({
          error: 'could not find that blog'
        })
        return
      }
      blog.createPost({
          text: req.body.text,
          // @ts-ignore
          UserId: req.session.user.id
        })
        .then(post => {
          res.status(201).json(post)
        })
    })
})

router.get('/:blogId/posts', (req, res) => {
  models.Blog.findByPk(req.params.blogId)
    .then(blog => {
      if (!blog) {
        res.status(404).json({
          error: 'Could not find blog with that id'
        })
        return
      }
      blog.getPosts().then(posts => {
        res.json(posts)
      })
    })
})



module.exports = router;
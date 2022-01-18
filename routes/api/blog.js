//@ts-check

const express = require('express')
const router = express.Router();
const models = require('../../models')
const checkAuth = require('../../checkAuth')

//View all Blogs(list)
router.get('/', (req, res, next) => {
  models.Blog.findAll()
    .then(blogs => {
      res.json(blogs)
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
  models.Blog.findByPk(id)
    .then((blog) => {
      if (blog) {
        // if there is any data, send it back as JSON
        res.json(blog)
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

//Add Blogs

// router.post('/', checkAuth, (req, res, next) => {
//     models.Blog.create({
//         title: '???',
//         createdAt: new Date(),
//         updatedAt: new Date()
//     })

//     .then((blog) => {
//         res.status(201).json(blog);
//     });

// });

//Update Blogs

// router.patch('/', checkAuth, (req, res, next) => {
//     models.Blog.update({
//             title: '???',
//         }, { where: { id: ? } }, )
//         .then((blog) => {
//             res.json(blog);
//         })
//         .catch(e => {
//             res.status(404).json({
//                 error: 'could not find an item with that id'
//             })
//         })

// });

//Delete Blog

// router.delete('/', checkAuth, (req, res, next) => {
//     models.Blog.destroy({ where: { id: ? } }, )
//         .then((blog) => {
//             res.json(blog);
//         })
//         .catch(e => {
//             res.status(404).json({
//                 error: 'could not find an blog with that id'
//             })
//         })
// });

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
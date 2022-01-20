//@ts-check

const express = require('express')
const router = express.Router();
const models = require('../../models')
const checkAuth = require('../../checkAuth');
const like = require('../../models/like');

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
//create posts
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
  // get all posts
router.get('/:blogId/posts', (req, res) => {
  models.Blog.findByPk(req.params.blogId)
    .then(blog => {
      if (!blog) {
        res.status(404).json({
          error: 'Could not find blog with that id'
        })
        return
      }
      blog.getPosts({
        order: [
          ["createdAt", "DESC"]
        ],
        include: [models.Comment, models.Like, models.Dislike]
      }).then(posts => {
        res.json(posts)
      })
    })
})

// create comments on a post
router.post('/:blogId/posts/:postId/comments', checkAuth, (req, res) => {
    if (!req.body.comment) {
      res.status(400).json({
        error: 'Please include text'
      })
      return
    }
    models.Post.findByPk(req.params.postId)
      .then(post => {
        if (!post) {
          res.status(404).json({
            error: 'could not find that post'
          })
          return
        }
        post.createComment({
            comment: req.body.comment,
            // @ts-ignore
            UserId: req.session.user.id
          })
          .then(comment => {
            res.status(201).json(comment)
          })

      })
  })
  //get comments on a post
router.get('/:blogId/posts/:postId/comments', checkAuth, (req, res) => {
    models.Post.findByPk(req.params.postId)
      .then(post => {
        if (!post) {
          res.status(404).json({
            error: 'Could not find post with that id'
          })
          return
        }
        post.getComments().then(comments => {
          res.json(comments)
        })
      })
  })
  //delete comments on a post 
router.delete('/:blogId/posts/:postId/comments/:commentId', checkAuth, (req, res) => {
  models.Comment.destroy({ where: { id: req.params.commentId } })
    .then(rowsDeleted => {
      if (rowsDeleted == 1) {
        console.log('Deleted Successfully');
        res.json(rowsDeleted);
        return;
      } else {
        res.status(404).json({
          error: 'enter a valid id'
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
})

router.post('/:blogId/posts/:postId/likes', checkAuth, (req, res) => {
  models.Post.findByPk(req.params.postId)
    .then(post => {
      if (!post) {
        res.status(404).json({
          error: 'could not find that post'
        })
        return
      }
      models.Like.findAll({
        where: {
          //@ts-ignore
          UserId: req.session.user.id,
          PostId: req.params.postId
        }
      }).then(likes => {
        if (likes.length) {
          res.status(400).json({
            error: 'You already like this post'
          })
        } else {
          post.createLike({
              // @ts-ignore
              UserId: req.session.user.id
            })
            .then(like => {
              res.status(201).json(like)
            })
          models.Dislike.destroy({
            where: {
              //@ts-ignore
              UserId: req.session.user.id,
              PostId: req.params.postId
            }
          })
        }
      })
    })
})
router.post('/:blogId/posts/:postId/dislikes', checkAuth, (req, res) => {
  models.Post.findByPk(req.params.postId)
    .then(post => {
      if (!post) {
        res.status(404).json({
          error: 'could not find that post'
        })
        return
      }
      models.Dislike.findAll({
        where: {
          //@ts-ignore
          UserId: req.session.user.id,
          PostId: req.params.postId
        }
      }).then(dislikes => {
        if (dislikes.length) {
          res.status(400).json({
            error: 'You already dislike this post'
          })
        } else {
          post.createDislike({
              // @ts-ignore
              UserId: req.session.user.id
            })
            .then(dislike => {
              res.status(201).json(dislike)
            })
          models.Like.destroy({
            where: {
              //@ts-ignore
              UserId: req.session.user.id,
              PostId: req.params.postId
            }
          })
        }
      })
    })
})













module.exports = router;
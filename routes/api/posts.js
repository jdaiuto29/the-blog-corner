//@ts-check

const express = require('express')
const router = express.Router();
const models = require('../../models')
const checkAuth = require('../../checkAuth');
const like = require('../../models/like');

//View all Blogs(list)
router.get('/', (req, res, next) => {
  models.Post.findAll({
      include: [models.Blog, models.Like, models.Dislike, models.Comment]
    })
    .then(posts => {
      res.json(posts)
    })
    .catch(e => {
      console.error(e)
      res.status(500).json({
        error: 'Server Error'
      })
    })
});












module.exports = router;
const express = require('express')
const router = express.Router()
const models = require('../../models')
// const checkAuth = require('../../checkAuth')

//get all the blogs
router.get('/', (req, res) => {
    models.Blog.findAll()
    .then (blogs => {
        res.json(blogs)
    })
})



module.exports = router 
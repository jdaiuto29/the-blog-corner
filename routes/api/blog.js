var express = require('express');
const res = require('express/lib/response');
const router = express.router
const models = require('./models')

router.get ('/', (req, res) => {
    models.Blogs.findAll ()
    .then (blog => {
        console.log (blog)
    }
        )
})
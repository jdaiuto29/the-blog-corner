const express = require('express')
const router = express.Router()
const models = require('../../models')
const bcrypt = require('bcrypt')

/* GET users listing. */
/* POST /api/v1/users/register */
router.post('/register', function(req, res, next) {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
        res.status(400).json({
            error: 'please include all required fields'
        })
        return
    }

    models.User.findAll({
        where: {
            email: req.body.email
        }
    }).then(users => {
        if (users.length) {
            res.status(400).json({
                error: 'That user already exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10).then(hash => {
                models.User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash
                }).then(user => {
                    res.status(201).json(user)
                })
            })
        }
    })
});

router.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            error: 'please include all required fields'
        })
        return
    }
    models.User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            res.status(404).json({
                error: 'no user with that email found'
            })
            return
        }

        bcrypt.compare(req.body.password, user.password)
            .then(match => {
                if (!match) {
                    res.status(401).json({
                        error: 'incorrect password'
                    })
                    return
                }
                req.session.user = user
                res.json(user)
            })
    })
})

router.get('/logout', (req, res) => {
    req.session.user = null;
    res.json({
        success: 'user logged out'
    })
})

router.get('/:userId/profile', (req, res) => {
    models.User.findByPk(req.params.userId, {
        attribute: ['title'],
        include: {
            model: models.Post,
            include: models.Blog

        }
    })

    .then(user => {
        if (!user) {
            res.status(404).json({
                error: 'Could not find user with that id'
            })
            return
        }
        res.json({
            name: user.name,
            reviews: user.Posts
        })
    })
})
module.exports = router;
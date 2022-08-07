// Routes to /shop.

// Requires.
const express = require('express')
const auth = require('../middleware/auth')
const { creatorName } = require('../helper')

// Declare router to export.
const router = new express.Router()

// Get /shop and render the view and send the information for it.
router.get('/shop', (req, res) => {
    res.render('shop', {
        creatorName
    })
})

module.exports = router
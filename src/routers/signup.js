const express = require('express')
const User = require('../models/user')
const { creatorName } = require('../helper')

const router = new express.Router()

router.post("/signup", async (req, res) => {
    const user = new User(req.body)

    try {
        const token = await user.generateAuthToken()
        await user.save()

        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})
router.get("/signup", (req, res) => {
    res.render("signup", {
        creatorName
    })
})
module.exports = router
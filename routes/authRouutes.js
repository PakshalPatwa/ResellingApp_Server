const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');

require('dotenv').config();

router.post('/signup', (req, res) => {
    // res.send('Signup Page successfully Send');
    console.log('Sent by Client -', req.body);
    const { name, email, password, confirmpassword } = req.body;
    if (!name || !email || !password || !confirmpassword) {
        return res.status(422).send({ error: "Please fill all the fields" })
    }

    User.findOne({ email: email })
        .then(
            async (savedUser) => {
                if (savedUser) {
                    return res.status(422).send({ error: "Invalid Credential" });
                }
                const user = new User({
                    name,
                    email,
                    password,
                    confirmpassword
                })
                try {
                    await user.save();
                    // res.send({ message: "User Saved Successfully" });
                    const token = jwt.sign({ _id: user._id }, process.env.jwt_secret);
                    res.send({ token });
                }
                catch (err) {
                    console.log('db err', err);
                    return res.status(422).send({ error: err.message })
                }
            }
        )
})

module.exports = router;
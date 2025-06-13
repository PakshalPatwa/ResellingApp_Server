const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

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

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or Password" });
    }
    const savedUser = await User.findOne({ email: email })

    if (!savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" })
    }

    try {
        bcrypt.compare(password, savedUser.password, (err, result) => {
            if (result) {
                console.log('Password Matched');
                const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_secret);
                res.send({ token });
            }
            else {
                console.log('Password Does Not Match');
                return res.status(422).json({ error: "Invalid Credentials" });
            }
        })
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;
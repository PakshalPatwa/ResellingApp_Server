const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    confirmpassword: {
        type: String,
        require: true
    },
})

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    user.password = await bcrypt.hash(user.password, 8);
    user.confirmpassword = await bcrypt.hash(user.confirmpassword, 8);

    console.log("Just before saving & after hasing", user.password)
    console.log("Just before saving & after hasing", user.confirmpassword)

    next();
})

mongoose.model("User", userSchema);
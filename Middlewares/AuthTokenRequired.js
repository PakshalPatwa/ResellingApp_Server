const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model("User");
require('dotenv').config();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    // With Bearer
    // console.log(authorization);
    if (!authorization) {
        return res.status(401).send({ error: "You must be logged in key not given" });
    }

    // Without Bearer
    const token = authorization.replace("Bearer ", "");
    // console.log(token);
    jwt.verify(token, process.env.jwt_secret,(err,payload)=>{
      if(err) {
        return res.status(401).json({error:"You must be logged in token invalid"});
      }

      const{_id} = payload;
      User.findById(_id).then(userData =>{
        req.user = userData;
        next();
      })
    })
}
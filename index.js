const express = require('express');
const port = 3000;

const app = express();
const bodyParser = require('body-parser');
// 
require('./db');
require('./models/User');
// 
const authRoutes = require('./routes/authRouutes');
const requireToken = require('./Middlewares/AuthTokenRequired')
// 
app.use(bodyParser.json());
app.use(authRoutes);
// 

app.get('/', requireToken, (req, res) => {
    console.log(req.user);
    res.send(req.user);
})

// app.post('/signup', (req, res) => {
//     console.log(req.body);
//     res.send('This is Signup page');
// })

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
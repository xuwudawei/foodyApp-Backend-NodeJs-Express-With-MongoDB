const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require("../middleware/error");

module.exports = function(app){ 
    app.use(express.json());
app.use('/user/service/create', users);
app.use('/authentication/service/user/login', auth);
app.use(error);
}
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');
const {
  generatePassword,
  getRandomInt,
  containsAny,
  removeFieldWithEmptyNullOrUndefineFromObject,
} = require('../util/function');

// router.get('/', async (req, res) => { 
//     const users = await User.find().sort('name');
//     res.send(users);
// });

router.get('/test', (req, res) => { 
    res.send('Hello from user route, backend is working!');
});
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
router.get('/me',auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    // if (!user) return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ message: "Account already exists", exists: true });
    
    user = new User(_.pick(req.body, ['name', 'email', 'phone', 'address','password', 'uniqueID', 'pic']));
    // Generate five random numbers
    const otp = getRandomInt(10000, 99999);
    const salt = await bcrypt.genSalt(10);
    user.password = (await bcrypt.hash(user.password, salt)).toString();; 
    const token = user.generateAuthToken();
    //add token to user account
    user.token = token;
    //adding additional fields to user account
    user.stage = 0;
    user.verified = false;
    user.isAdmin = false;
    user.contactsVerified = false;
    user.status = "processing";
    user.logged = false;
    await user.save();

    // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
     res.header('x-auth-token',token).send({ user, message: "New user created successfully" });
});

// router.put('/:id', async (req, res) => {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);
//     try {
//         if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(404).send('The given id for user is invalid.'); 
//         }
//         const user = await User.findByIdAndUpdate(req.params.id, {
//             $set: {
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password
//             }
//         }, { new: true });
//            if (!user) return res.status(404).send('The user with the given ID was not found.');
//         res.send(user);
//     } catch (error) {
//          res.send(error.message);
        
//     }
// });

// router.delete('/:id', async (req, res) => {
//      const user = await User.findByIdAndRemove(req.params.id);
//     if (!user) return res.status(404).send('The user with the given ID was not found.');
//      res.send(`The user with ID: ${req.params.id} has been deleted successfully.`);
//  });

module.exports=router; 
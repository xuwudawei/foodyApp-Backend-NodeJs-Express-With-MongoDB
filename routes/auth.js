const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const Joi = require('joi');


// router.get('/', async (req, res) => { 
//     const users = await User.find().sort('name');
//     res.send(users);
// });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
// router.get('/:id', async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).send('The user with the given ID was not found.');
//     res.send(user);
// });




router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password!");
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password!");
    
     const token = user.generateAuthToken();
    res.send(token);
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
// });
 
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(req);
}

module.exports = router;
 
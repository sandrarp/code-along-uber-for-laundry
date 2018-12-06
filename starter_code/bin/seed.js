const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost/uber-for-loundry'); 

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

const password = '1234';
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);

const seedUsers = [
    {name: 'Homer', email: 'homer@simpson.com', password: hashPass},
    {name: 'Marge', email: 'marge@simpson.com', password: hashPass},
    {name: 'Lisa', email: 'lisa@simpson.com', password: hashPass}
]

User.collection.drop();

User.insertMany(seedUsers)
.then(user => {
    console.log("users created");
    console.log(user);

    mongoose.connection.close();
})
.catch(err => console.error(err));
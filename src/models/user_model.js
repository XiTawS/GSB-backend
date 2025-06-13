const mongoose = require('mongoose');
const sha256 = require('js-sha256');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://www.gravatar.com/avatar/?d=mp'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    const existingUser = await User.findOne({email: this.email});
    if(existingUser){
        throw new Error('User already exists');
    }
    this.password = sha256(this.password + process.env.SALT);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
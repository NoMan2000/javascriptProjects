const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
        local: {
            name: String,
            email: String,
            password: String
        }
    }),
    generateHash = (password, salt = 8) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(salt), null);
    },
    isValidPassword = (password) => {
        return bcrypt.compareSync(password, this.local.password);
    };

userSchema.methods.generateHash = generateHash;

userSchema.methods.isValidPassword = isValidPassword;

module.exports = mongoose.model('User', userSchema);

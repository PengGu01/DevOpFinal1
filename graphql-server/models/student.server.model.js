// Load bcrypt module, used to hash the passwords
const bcrypt = require('bcrypt')
// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a new 'StudentSchema'
const StudentSchema = new Schema({
    studentNumber: { 
        type: String, 
        unique: true, 
        required: 'Student Number is required',
        trim: true 
    },
    password: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    phoneNumber: String,
    email: String,
    program: String,
});
// hash the passwords before saving
StudentSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
})
//
// Create the 'User' model out of the 'UserSchema'
module.exports = mongoose.model('Student', StudentSchema);
// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define a new 'StudentSchema'
const CourseSchema = new Schema({
    courseCode: {
        type: String,
        trim:true,
        required: 'Course code cannot be blank'
    },
    courseName: {
        type: String, default: '',
        trim: true
    },
    section: {
        type: String, default: '',
        trim: true
    },
    semester: {
        type: String, default: '',
        trim: true
    },
    // studentId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Student'
    // },
    //studentIds , array of student ids , type is an array of mongoose.Schema.Types.ObjectId
    studentIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]

});

// Create the 'Course' model out of the 'UserSchema'

const CourseModel = mongoose.model('Course', CourseSchema);

module.exports = CourseModel

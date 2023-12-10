//user.server.resolvers.js
const Student = require('../models/student.server.model');

// 
const updateStudent = async (parent, args) => {
    console.log('args in update student :', args);
    try {
      const { id, ...update } = args;
      const options = { new: true };
      let student = await Student.findByIdAndUpdate(id, update, options);
  
      if (!student) {
        throw new Error(`Student with ID ${id} not found`);
      }
      student = await student.save();
      return student;
    } catch (error) {
      console.error('Error updating student:', error);
      throw new Error('Failed to update student');
    }
  };

// Make resolvers available to other modules
module.exports = {
    updateStudent
};  
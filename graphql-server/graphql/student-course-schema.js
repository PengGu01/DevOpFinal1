const { updateStudent} = require('../resolvers/student.server.resolver');
// A GraphQL schema that defines types, queries and mutations
//
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
} = require('graphql');
//
const StudentModel = require('../models/student.server.model'); // Import your User model
const CourseModel = require('../models/course.server.model'); // Import your Article model

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "some_secret_key"; // generate this elsewhere
const jwtExpirySeconds = 300;

//

//
// Create a GraphQL Object Type for User model
// The fields object is a required property of a GraphQLObjectType
// and it defines the different fields or query/mutations that are available
// in this type.
const studentType = new GraphQLObjectType({
    name: 'student',
    fields: function () {
      return {

        id: {
          type: GraphQLID // Unique identifier for the student (typically corresponds to MongoDB _id)
        },
        studentNumber: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        },
        firstName: {
          type: GraphQLString
        },
        lastName: {
          type: GraphQLString
        },
        address: {
          type: GraphQLString
        },
        city: {
          type: GraphQLString
        },
        phoneNumber: {
          type: GraphQLString
        },
        program: {
          type: GraphQLString
        }

      }
    }
  });

  const courseType = new GraphQLObjectType({
    name: 'course',
    fields: function (){
      return {
        id: { type: GraphQLID },
        courseCode: { type: GraphQLString },
        courseName: { type: GraphQLString },
        section: { type: GraphQLString },
        semester: { type: GraphQLString },
        studentId: { type: GraphQLID }
    };},
  });
  //

  // Create a GraphQL query type that returns a user by id
  // In this case, the queries are defined within the fields object.
  // The fields object is a required property of a GraphQLObjectType
  // and it defines the different fields or query/mutations that are available
  // in this type.
  //
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      return {

        students: {
          type: new GraphQLList(studentType),
          resolve: function () {
            const students = StudentModel.find().exec()
            if (!students) {
              throw new Error('Error')
            }
            return students
          }
        },
        student: {
          type: studentType,
          args: {
            id: {
              name: 'id',
              type: GraphQLString
            }
          },
          resolve: async function (root, params) {
            console.log('Executing student resolver with params:', params);
            try {
              const studentInfo = await StudentModel.findById(params.id).exec();
              console.log('Student info:', studentInfo);

              if (!studentInfo) {
                console.error('User not found for id:', params.id);
                throw new Error('Error');
              }

              return studentInfo;
            } catch (error) {
              console.error('Error fetching student:', error);
              throw new Error('Failed to fetch student');
            }
          }
        },
        // check if user is logged in
        isLoggedIn: {
          type: GraphQLBoolean,
          args: {
            studentNumber: {
              name: 'studentNumber',
              type: GraphQLString
            }

          },
          resolve: function (root, params, context) {
            const token = context.req.cookies.token;

            // If the cookie is not set, return false
            if (!token) {
              return false;
            }

            try {
              // Try to verify the token
              jwt.verify(token, JWT_SECRET);
              return true;  // Token is valid, user is logged in
            } catch (e) {
              // If verification fails, return false
              return false;
            }
          },
        },
        studentcourses: {
          type: new GraphQLList(courseType),
          resolve: function   (root, params, context) {

            console.log('Executing student resolver with params:');

            //find all courses ,output fields id, courseCode, courseName, section, semester



            //get student id from token
            const token = context.req.cookies.token;
            console.log('Token:', token);

            const decodedToken = jwt.verify(token, JWT_SECRET);
            console.log('Decoded token:', decodedToken);
            const studentId = decodedToken._id;

            // const courses = CourseModel.find().exec()
            //            const courses = CourseModel.find({studentId: studentId}).exec()
            //find all courses for studentId ,where studentId  included in studentIds
            const courses = CourseModel.find({studentIds: studentId}).exec()


            if (!courses) {
              throw new Error('Error')
            }
            return courses
          }
        },
        courses: {
          type: new GraphQLList(courseType),
          resolve: function () {
            const courses = CourseModel.find().exec()
            if (!courses) {
              throw new Error('Error')
            }
            return courses;
          },
        },



        //add by ShuJin
        distinctcourses: {
          type: new GraphQLList(courseType),
          resolve: function () {
            const courses = CourseModel.find().exec()
            if (!courses) {
              throw new Error('Error')
            }
            return courses;
          },
        },


        course: {
          type: courseType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
          },
          resolve: async function (root, { id }) {
            try {
              const course = await CourseModel.findById(id).exec();

              if (!course) {
                throw new Error('Course not found');
              }

              return course;
            } catch (error) {
              console.error('Error fetching course:', error);
              throw new Error('Failed to fetch course');
            }
          },
        },

      }
    }
  });
  //
  // Add a mutation for creating user
  // In this case, the createUser mutation is defined within the fields object.
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
      return {
        addStudent: {
          type: studentType,
          args: {
            studentNumber: {
              type: new GraphQLNonNull(GraphQLString)
            },
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            password: {
              type: new GraphQLNonNull(GraphQLString)
            },
            firstName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            lastName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            address: {
              type: new GraphQLNonNull(GraphQLString)
            },
            city: {
              type: new GraphQLNonNull(GraphQLString)
            },
            phoneNumber: {
              type: new GraphQLNonNull(GraphQLString)
            },
            program: {
              type: new GraphQLNonNull(GraphQLString)
            }

          },
          resolve: function (root, params, context) {
            const studentModel = new StudentModel(params);
            const newStudent = studentModel.save();
            if (!newStudent) {
              throw new Error('Error');
            }
            return newStudent
          }
        },

        updateStudent: {
          type: studentType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLString)
            },
            studentNumber: {
              type: new GraphQLNonNull(GraphQLString)
            },
            firstName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            lastName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            address: {
              type: new GraphQLNonNull(GraphQLString)
            },
            city: {
              type: new GraphQLNonNull(GraphQLString)
            },
            phoneNumber: {
              type: new GraphQLNonNull(GraphQLString)
            },
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            program: {
              type: new GraphQLNonNull(GraphQLString)
            }

          },
          resolve: updateStudent
        },

        // a mutation to log in the user
        loginUser: {
          type: GraphQLBoolean,
          args: {
            studentNumber: {
              name: 'studentNumber',
              type: GraphQLString
            },
            password: {
              name: 'password',
              type: GraphQLString
            }
          },
          resolve: async function (root, params, context) {
            const studentInfo = await StudentModel.findOne({ studentNumber: params.studentNumber }).exec();
            if (!studentInfo) {
              return false;  // Authentication failed
            }

            const isValidPassword = await bcrypt.compare(params.password.trim(), studentInfo.password);
            if (!isValidPassword) {
              return false;  // Authentication failed
            }
            try {
              const token = jwt.sign(
                { _id: studentInfo._id, studentNumber: studentInfo.studentNumber },
                JWT_SECRET,
                { algorithm: 'HS256', expiresIn: jwtExpirySeconds }
              );

              context.res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000, httpOnly: true });
              return true;  // Authentication successful
            } catch (error){
              console.error('Error generating token:', error);
              return false;
            }
          },
        },
        // a mutation to log the user out
        logOut: {
          type: GraphQLString,
          resolve: (parent, args, context) => {
            context.res.clearCookie('token');
            return 'Logged out successfully!';
          },
        },
        addCourse: {
          type: courseType,
          args: {
            courseCode: { type: new GraphQLNonNull(GraphQLString) },
            courseName: { type: new GraphQLNonNull(GraphQLString) },
            section: { type: new GraphQLNonNull(GraphQLString) },
            semester: { type: new GraphQLNonNull(GraphQLString) },
          },
          resolve: async function (root, { courseCode, courseName, section, semester }, context) {
            let msg= 'Course added successfully: '
            // Check if the user is logged in
            const token = context.req.cookies.token;

            if (!token) {
              throw new Error('User not authenticated');
            }

            try {
              // Verify the token to get the user ID
              const decodedToken = jwt.verify(token, JWT_SECRET);
              const studentId = decodedToken._id;

              const studentIds = [];


              var targetCourse = await CourseModel.findOne({ courseCode: courseCode }).exec();
              //if exist course with courseCode ,then throw error
                if (targetCourse) {
                  msg = 'Course already exist :'
                  msg = msg.concat(courseCode);

                  // throw new Error(msg); // Throw an error so the client can handle it

                  //add current student id to studentIds
                    targetCourse.studentIds.push(studentId);
                    msg = msg.concat(' , added studentId to  Course.studentIds: ', studentId);
                    await targetCourse.save();
                    throw new Error(msg); // Throw an error so the client can handle it
                }
                else {


                  // Continue with adding the article, including the authorId
                  const courseModel = new CourseModel({courseCode, courseName, section, semester, studentIds});

                  //add current student id to studentIds
                  courseModel.studentIds.push(studentId);
                  targetCourse=courseModel;
                }

              const savedCourse = await targetCourse.save();

              return savedCourse;
            } catch (error) {
              console.error('Error adding course:', error);
              throw new Error('Failed to add course -' + error.message);
            }
          },
        },
        editCourse: {
          type: courseType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            courseCode: { type: new GraphQLNonNull(GraphQLString)  },
            courseName: { type: new GraphQLNonNull(GraphQLString) },
            section: { type: new GraphQLNonNull(GraphQLString) },
            semester: { type: new GraphQLNonNull(GraphQLString) },
          },
          resolve: async function (root, params, context) {
            const token = context.req.cookies.token;
            if (!token) {
              return 'not-auth';
            }

            try {
              // Get the user ID from the token
              const { _id: studentId } = jwt.verify(token, JWT_SECRET);

              // Find the article by ID
              const course = await CourseModel.findById(params.id).exec();
              console.log(studentId);
              console.log(course.studentIds);
              // Check if the user making the edit is the author of the article
              if (!course || (course.studentIds.includes(studentId)) !== true) {
                throw new Error('Unauthorized');
              }

              // Update the article content
              const updatedCourse = await CourseModel.findByIdAndUpdate(
                params.id,
                { courseCode: params.courseCode,
                  courseName: params.courseName,
                  section: params.section,
                  semester: params.semester },
                { new: true }
              ).exec();

              return updatedCourse;
            } catch (error) {
              console.error('Error editing course:', error);
              // Handle the error, e.g., show an error message to the user.
              throw new Error('Failed to edit course');
            }
          },
        },

        deleteCourse: {
          type: courseType,
          args: {
            courseCode: { type: new GraphQLNonNull(GraphQLString) },
          },
          resolve: async function (root, params){
            try {
              const deletedCourse = await CourseModel.findOneAndRemove({ courseCode: params.courseCode }).exec();

              if (!deletedCourse) {
                throw new Error(`course not found`);
              }

              return deletedCourse;
            } catch (error) {
              console.error('Error deleting course:', error);
              throw new Error('Failed to delete course');
            }
          }
        },

        dropCourse: {
          type: courseType,
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
          },
          resolve: async function (root, params, context){
            const token = context.req.cookies.token;
            if (!token) {
              return 'not-auth';
            }
            const dropedCourse = await CourseModel.findById(params.id).exec();
            console.log(dropedCourse.studentIds.length);
            try {
              // Verify the token to get the user ID
              const decodedToken = jwt.verify(token, JWT_SECRET);
              const studentId = decodedToken._id;

              if (!dropedCourse) {

                throw new Error(`course not found`);
              }
              if(dropedCourse.studentIds.length > 1 && (dropedCourse.studentIds.includes(studentId))==true){
                const index = dropedCourse.studentIds.indexOf(studentId);
                console.log(index);
                dropedCourse.studentIds.splice(index,1);
                console.log(dropedCourse);
                await dropedCourse.save();
              }else if (dropedCourse.studentIds.length == 1 && dropedCourse.studentIds.includes(studentId)==true){
                dropedCourse = await CourseModel.findByIdAndRemove(params.id).exec();
              }

              return dropedCourse;
            } catch (error) {
              console.error('Error deleting course:', error);
              throw new Error('Failed to delete course');
            }
          }
        },
        showStudentsbyCourse: {
          type: new GraphQLList(studentType),
          args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
          },
          resolve: async function (root, params, context){
            const course = await CourseModel.findById(params.id).exec();
            const students = [];
            console.log(course.studentIds.length);
            try {

              if (!course) {

                throw new Error(`course not found`);
              }
              course.studentIds.forEach(element => {
                const student = StudentModel.findById(element).exec();
                students.push(student);
              });

              return students;
            } catch (error) {
              console.error('Error:', error);
              throw new Error('Failed to find student');
            }
          }
        },
      }
    }
  });
  //
  module.exports = new GraphQLSchema({query: queryType, mutation: mutation});
  //
  //


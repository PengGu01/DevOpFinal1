import React, {useState, useEffect} from 'react';
import {gql, useQuery, useMutation} from "@apollo/client";
//import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
//import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
//
//
// To parse the GraphQL operations, we use a special function
// called a tagged template literal to allow us to express them
// as JavaScript strings. This function is named gql
//
// note the backquotes here
const GET_COURSES = gql`
    query GetCourses {
    courses{
        id
        courseCode
        courseName
        section
        semester
    }
}
`;
const GET_STUDENTS = gql`
    query GetStudents {
    students{
        id
        studentNumber
        firstName
        lastName
        address
        city
        phoneNumber
        email
        program
    }
}
`;
const  SHOW_STUDENTS_BY_COURSE = gql`
mutation ShowStudentsbyCourse($id: ID!) {
    showStudentsbyCourse(id: $id) {
      id
      studentNumber
        firstName
        lastName
        address
        city
        phoneNumber
        email
        program
      
    }
  }
`;
//
const CourseList = () => {
    const { loading, error, data , refetch } = useQuery(GET_COURSES);
    const [students, setStudents] = useState([]);
    // const { loading, error, data , refetch } = useQuery(GET_COURSES);
    const [showStudentsbyCourse,] = useMutation(SHOW_STUDENTS_BY_COURSE);
    console.log(data);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    
    const ShowStudentsbyCourse = async (courseId) => {
        try {
            const result = await showStudentsbyCourse({ variables: { id: courseId }});
            setStudents(result.data.showStudentsbyCourse);
            console.log(students);
          //refrefh data
            refetch();
        } catch (err) {
          console.error('Error showing students', err);
          // Handle the error, e.g., show an error message to the user.
        }
      };

    return (

        <div>

            <Table >
                <tbody>
                <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Section</th>
                    <th>Semester</th>
                    <th>Action</th>

                </tr>
                {data.courses.map((course, index) => (
                    <tr key={index}>
                        <td>{course.courseCode}</td>
                        <td>{course.courseName}</td>
                        <td>{course.section}</td>
                        <td>{course.semester}</td>
                        <td>
                            <button   className = "center" onClick={() => ShowStudentsbyCourse(course.id)}>Show Students</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <div>
                <h2>Show student</h2>
                <table>
                <tbody>
                <tr>
                        <th>Student Number</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Phone Number</th>
                        <th>email</th>
                        <th>Program</th>

                </tr>
                {students.map((student,index) => (
                    <tr key={index}>
                    <td>{student.studentNumber}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.address}</td>
                    <td>{student.city}</td>
                    <td>{student.phoneNumber}</td>
                    <td>{student.email}</td>
                    <td>{student.program}</td>
                        
                    </tr>
                ))}
                </tbody>
                </table>
            </div>
        
            <div className="center">
                <button className = "center" onClick={() => refetch()}>Refetch</button>
            </div>

        </div>

    );
}

export default CourseList

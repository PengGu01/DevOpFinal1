import React from 'react';
import {gql, useQuery} from "@apollo/client";
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
//
const CourseList = () => {

    const { loading, error, data , refetch } = useQuery(GET_COURSES);
    const { studentloading, studenterror, studentdata } = useQuery(GET_STUDENTS);
    console.log(studentdata);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    /*
    const displaystudent = studentdata.map((student,idx) => {
        if (data.course.studentId == null){return}else
        if (student.id == data.course.studentId){
            return (
                <tr key={idx}>
                    <td>{student.firstname} {student.lastname}</td>
                </tr>
            );
        }
    });
    */

    return (

        <div>
            
            <Table >
                <tbody>
                <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Section</th>
                        <th>Semester</th>

                </tr>
                {data.courses.map((course, index) => (
                        <tr key={index}>
                            <td>{course.courseCode}</td>
                            <td>{course.courseName}</td>
                            <td>{course.section}</td>
                            <td>{course.semester}</td>
                            
                        </tr>
                ))}
             </tbody>
            </Table>
            
            <div className="center">
                <button className = "center" onClick={() => refetch()}>Refetch</button>
            </div>
            
        </div>
        
    );
}

export default CourseList
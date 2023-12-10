import React,{useState, useEffect} from 'react';
import {gql, useQuery, useMutation} from "@apollo/client";
import { useParams, useNavigate } from 'react-router-dom';

import EditCourse from './EditCourse';
//
//
// To parse the GraphQL operations, we use a special function
// called a tagged template literal to allow us to express them
// as JavaScript strings. This function is named gql
//
// note the backquotes here
const GET_COURSES = gql`
    query GetCourses {
        courses {
            id
            courseCode
            courseName
            section
            semester        
    }
  }
`;
const GET_STUDENTS = gql`
{
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
const GET_STUDENT_COURSES = gql`
{
    studentcourses{
      id
      courseCode
      courseName
      section
      semester
      studentId
    }
}
`;
const  DROP_COURSE = gql`
mutation DropCourse($id: ID!) {
    dropCourse(id: $id) {
      id
      courseCode
      courseName
      section
      semester
      
    }
  }
`;
//
const ListCourses = () => {

    //const { loading, error, data , refetch } = useQuery(GET_COURSES);
    const [selectedCourse, setSelectedCourse] = useState(null);
    //GET_STUDENT_COURSES
    const { loading, error, data , refetch } = useQuery(GET_STUDENT_COURSES);
    const navigate = useNavigate()
    const { id } = useParams();
    //DROP_COURSE
    const [dropCourse] = useMutation(DROP_COURSE);

    useEffect(() => {
        console.log('refetching...');
        refetch();
    }, [refetch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    const handleClick = (courseId) => {
        setSelectedCourse(courseId);
    };
    const DropCourse = (courseId) => {
        try {
          dropCourse({ variables: { id: courseId }});
          //refrefh data
            refetch();
          navigate('/listcourses');
        } catch (err) {
          console.error('Error deleting course:', err);
          // Handle the error, e.g., show an error message to the user.
        }
      };

    return (

        <div>
            <h2>List of Courses</h2>
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Section</th>
                        <th>Semester</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.studentcourses.map((course, index  ) => (
                        <tr  key={course.id}>
                            <td>{course.courseCode}</td>
                            <td>{course.courseName}</td>
                            <td>{course.section}</td>
                            <td>{course.semester}</td>
                            <td>
                                <button    className = "center" onClick={() => handleClick(course.id)}>Edit Course</button>
                                <button   className = "center" onClick={() => DropCourse(course.id)}>Drop Course</button>
                            </td>
                        </tr>
                ))}
             </tbody>
            </table>
            {selectedCourse && (
            <div>
                <h2>Edit Course</h2>
                <EditCourse
                    courseId={selectedCourse}
                    existingCourseCode={data.studentcourses.find((course) => course.id === selectedCourse).courseCode}
                    existingCourseName={data.studentcourses.find((course) => course.id === selectedCourse).courseName}
                    existingSection={data.studentcourses.find((course) => course.id === selectedCourse).section}
                    existingSemester={data.studentcourses.find((course) => course.id === selectedCourse).semester}
                    onClose={() => setSelectedCourse(null)}
                />
            </div>
        )}

        <button onClick={() => refetch()}>Refetch</button>
        </div>

    );
}

export default ListCourses

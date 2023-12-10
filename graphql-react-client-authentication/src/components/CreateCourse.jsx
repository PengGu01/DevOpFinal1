import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//
import { useNavigate } from 'react-router-dom';

import "./entryform.css"
//
//
const CREATE_COURSE = gql`
    mutation addCourse( $courseCode: String!, $courseName: String!, $section: String!,
        $semester: String! ) {
        addCourse( courseCode: $courseCode, courseName: $courseName, section: $section,
            semester: $semester ) {
            courseCode
            courseName
            section
            semester
        }

    }
`;
//function component to add a student
const CreateCourse = () => {
    //
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [section, setSection] = useState('');
    const [semester, setSemester] = useState('');
    const navigate = useNavigate()
    //
    const [addCourse] = useMutation(CREATE_COURSE);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await addCourse( { variables: { courseCode, courseName,
            section, semester }
            });
          // Clear input fields
          setCourseCode('');
          setCourseName('');
          setSection('');
          setSemester('');
          navigate('/listcourses');
        } catch (err) {
          console.error('Error creating  Course:', err);
          // Handle the error, e.g., show an error message to the user.
          console.log(err.graphQLErrors[0].message)

            // Check if the error is a GraphQL error
            if (err.graphQLErrors && err.graphQLErrors.length > 0) {
                // Extract the message from the first GraphQL error
                const errorMessage = err.graphQLErrors[0].message;
                console.log('GraphQL Error:', errorMessage);

                // Display the error message to the user
                alert('Error: ' + errorMessage);
            } else {
                // Handle non-GraphQL errors (e.g., network errors)
                alert('An error occurred: ' + err.message);
            }
          // alert(err);

        }
      };

    return (
        <div className = 'entryform'>
            <h2>Add a Course</h2>
            <form onSubmit={ handleSubmit }>

                    <Form.Group controlId="formCourseCode">
                        <Form.Label> Course Code:</Form.Label>
                        <Form.Control type="text" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formCourseName">
                        <Form.Label> Course Name:</Form.Label>
                        <Form.Control type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formSection">
                        <Form.Label> Section:</Form.Label>
                        <Form.Control type="text" value={section} onChange={(e) => setSection(e.target.value)}/>
                    </Form.Group>

                    <Form.Group controlId="formSemester">
                        <Form.Label> Semester:</Form.Label>
                        <Form.Control type="text" value={semester} onChange={(e) => setSemester(e.target.value)}/>
                    </Form.Group>

                    <Button variant="primary" type="submit"> Create Course </Button>

            </form>
        </div>
    );
}
//
export default CreateCourse

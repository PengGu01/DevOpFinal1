import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';

const EDIT_COURSE = gql`
  mutation EditCourse($id: ID!, $courseCode: String!,
    $courseName: String!, $section: String!, $semester: String!) {
    editCourse(id: $id, courseCode: $courseCode, courseName: $courseName,
        section: $section, semester: $semester) {
      id
      courseCode
      courseName
      section
      semester
    }
  }
`;

const EditCourse = ({ courseId, existingCourseCode, existingCourseName,
    existingSection, existingSemester, onClose }) => {
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [section, setSection] = useState('');
  const [semester, setSemester] = useState('');

  useEffect(() => {
    // Set the initial content when the component mounts
    setCourseCode(existingCourseCode);
    setCourseName(existingCourseName);
    setSection(existingSection);
    setSemester(existingSemester);
  }, [existingCourseCode, existingCourseName,
    existingSection, existingSemester]);

  const [editCourse] = useMutation(EDIT_COURSE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editCourse({ variables: { id: courseId, courseCode,
         courseName, section, semester } });
      onClose();
    } catch (err) {
      console.error('Error editing course:', err);
      // Handle the error, e.g., show an error message to the user.
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Code:</label>
          <textarea value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
        </div>
        <div>
          <label>Course Name:</label>
          <textarea value={courseName} onChange={(e) => setCourseName(e.target.value)} />
        </div>
        <div>
          <label>Section:</label>
          <textarea value={section} onChange={(e) => setSection(e.target.value)} />
        </div>
        <div>
          <label>Semester:</label>
          <textarea value={semester} onChange={(e) => setSemester(e.target.value)} />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
import './App.css';
//
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes
} from "react-router-dom";
//
// This app requires react-bootstrap and bootstrap installed:
//  npm install react-bootstrap bootstrap
//
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import './App.css';
//
import CoursesHome from './components/CoursesHome';
import StudentList from './components/StudentList';
import CreateStudent from './components/CreateStudent';
import EditStudent from './components/EditStudent';

import CourseList from './components/AllCourseList';
import ListCourses from './components/ListCourses';
import CreateCourse from './components/CreateCourse';
import EditCourse from './components/EditCourse';

import Login from './components/Login';
import Home from './components/Home';

//
function App() {

  return (
    <Router>

      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="home">React Client For GraphQL API</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/home" >Home</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/studentlist">Student List</Nav.Link>
              <Nav.Link as={Link} to="/courselist">Course List</Nav.Link>
              <Nav.Link as={Link} to="/createstudent">Sign Up</Nav.Link>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div>
        <Routes>
          <Route index element={<Home />} />
          <Route path = "home" element={<Home />} />
          <Route path = "login" element= {< Login />}  />
          <Route path = "studentlist" element={<StudentList />} />
          <Route path = "courselist" element={<CourseList />} />
          <Route path = "createstudent" element={<CreateStudent />} />
          <Route path = "editstudent/:id" element={<EditStudent />} />
          <Route path = "listcourses" element={<ListCourses />} />
          <Route path = "createcourse" element={<CreateCourse />} />
          <Route path = "editcourse/:id" element={<EditCourse />} />
          <Route path = "coursesHome" element={<CoursesHome/>} />


        </Routes>
    </div>



    </Router>


  );
}
//
export default App;

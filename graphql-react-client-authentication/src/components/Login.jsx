//Login.js
import React, { useState, useEffect } from 'react';
//import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import "./entryform.css"
//
import CoursesHome from './CoursesHome'
//
// mutation for user login
const LOGIN_USER = gql`
    mutation LoginUser( $studentNumber: String!, $password: String! ) {
        loginUser( studentNumber: $studentNumber, password: $password  )         

    }
`;
// query for checking if user is logged in
const LOGGED_IN_USER = gql`
  query IsLoggedIn {
    isLoggedIn
  }
`;
// Login function component
function Login() {
    //
    let navigate = useNavigate()
    // loginUser is a function that can be called to execute
    // the LOGIN_USER mutation, and { data, loading, error } 
    // is an object that contains information about the state of the mutation.
    const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
    //
    //state variable for the screen, admin or user
    const [screen, setScreen] = useState(false);
    //store input field data, user name and password
    let [studentNumber, setStudentNumber] = useState('');
    let [password, setPassword] = useState('');
    //
   
    const handleLogin = async (event) => {
        event.preventDefault();
        console.log('student number and password: ', studentNumber + ' ' + password);

        try {
          const { data } = await loginUser({
            variables: { studentNumber, password }
            
          });
          //refetchQueries: [{ query: LOGGED_IN_USER }],
          console.log('data from server: ', data)
          console.log('Logged in as:', data.loginUser);
          setScreen(data.loginUser);
          setStudentNumber('');
          setPassword('');
          console.log('screen: ', screen)
        } catch (error) {
          console.error('Login error:', error);
        }
    };
    // a destructuring assignment that uses the useQuery hook from
    //  the @apollo/client library to fetch data from a GraphQL server.
    const { data: isLoggedInData, loading: isLoggedInLoading,
       error: isLoggedInError, refetch: refetchLoggedInData } = useQuery(LOGGED_IN_USER);
    console.log('isLoggedInData: ',isLoggedInData)
    //
    useEffect(() => {
      // Check if the user has already logged in
      const checkLoginStatus = async () => {
        try {
          console.log('--- in checkLoginStatus function ---');
          await refetchLoggedInData();
          const isLoggedInVar = isLoggedInData?.isLoggedIn;
          console.log('auth status from graphql server: ', isLoggedInVar);
          if (isLoggedInVar !== undefined && isLoggedInVar !== screen) {
            setScreen(isLoggedInVar);
          }
        } catch (e) {
          setScreen(false);
          console.log('error: ', e);
        }
      };
      
      checkLoginStatus();
      
    }, [isLoggedInData, refetchLoggedInData, screen]);
    
    // Check if user is logged in
  if (isLoggedInData?.isLoggedIn === true) {
    console.log('student is logged in');
    console.log('screen: ', screen);
  }

    
    

    // Render the login form or the welcome message based on the value of 'screen'
    return (
        <div className="entryform">
            { screen !==false ? (
                <CoursesHome screen={screen} setScreen={setScreen} /> ) : (

                <Form onSubmit={handleLogin}>
                    
                    <Form.Group>
                        <Form.Label> Student Number:</Form.Label>
                        <Form.Control id="studentNumber" type="text"  onChange={(event) => setStudentNumber(event.target.value)} 
                            placeholder="Student Number:" />
                    </Form.Group>                    
                    
                    <Form.Group>
                        <Form.Label> Password:</Form.Label>
                        <Form.Control id="password" type="password"  onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password:" />
                    </Form.Group>  
            
                    <Button size = "lg" variant="primary" type="submit" >
                        Login
                    </Button>
                  
                </Form>
            )}            
            
        </div>
    );
}
//
export default Login;
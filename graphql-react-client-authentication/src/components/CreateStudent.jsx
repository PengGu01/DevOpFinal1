import React,{useState} from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//
import { useNavigate } from 'react-router-dom';

import "./entryform.css"
//
//
const ADD_STUDENT = gql`
    mutation AddStudent( $studentNumber: String!, $password: String!, $firstName: String!,
        $lastName: String!, $address: String!, $city: String!, $phoneNumber: String!,
        $email: String!, $program: String! ) {
        addStudent( studentNumber: $studentNumber, password: $password, firstName: $firstName,
            lastName: $lastName, address: $address, city: $city, phoneNumber: $phoneNumber,
            email: $email, program: $program  ) {
            studentNumber
            password
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
//function component to add a student
const CreateStudent = () => {
    //
    let navigate = useNavigate()
    //
    const [studentNumber, setStudentNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [program, setProgram] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [addStudent] = useMutation(ADD_STUDENT);

    const saveStudent = (e) => {
        setShowLoading(true);
        e.preventDefault();
        // Add user
        addStudent( { variables: { studentNumber, password,
            firstName, lastName, address, city,
            phoneNumber, email, program } 
            });
        // Clear input fields
        setStudentNumber('');
        setFirstName('');
        setLastName('');
        setAddress('');
        setCity('');
        setPhoneNumber('');
        setProgram('');
        setEmail('');
        setPassword('');
        setShowLoading(false);
        navigate('/studentlist')  // navigate to student list page
      };

    return (
        <div className = 'entryform'>
            {showLoading && 
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner> 
            } 
            <h2>Create Student</h2>
            <form onSubmit={saveStudent }>

                <Form.Group>
                    <Form.Label> Student Number</Form.Label>
                    <Form.Control type="text" name="studentNumber" 
                    id="studentNumber" placeholder="Enter student number" 
                    value={studentNumber} 
                    onChange={(e) => setStudentNumber(e.target.value)} />
                </Form.Group>

                    <Form.Group>
                        <Form.Label> Password:</Form.Label>
                        <Form.Control type="password" name="password" 
                        id="password" placeholder="Enter password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label> First Name:</Form.Label>
                        <Form.Control type="text" name="firstName" 
                        id="firstName" placeholder="Enter first name" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label> Last Name:</Form.Label>
                        <Form.Control type="text" name="lastName" 
                    id="lastName" placeholder="Enter last name" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label> Address:</Form.Label>
                        <Form.Control type="text" name="address" 
                    id="address" placeholder="Enter address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label> City:</Form.Label>
                        <Form.Control type="text" name="city" 
                    id="city" placeholder="Enter city" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label> Phone Number:</Form.Label>
                        <Form.Control type="text" name="phoneNumber" 
                    id="phoneNumber" placeholder="Enter phone number" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} />
                    </Form.Group>                    
              
                    <Form.Group>
                        <Form.Label> Email:</Form.Label>
                        <Form.Control type="email" name="email" 
                    id="email" placeholder="Enter email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label> Program:</Form.Label>
                        <Form.Control type="text" name="program" 
                    id="program" placeholder="Enter program" 
                    value={program} 
                    onChange={(e) => setProgram(e.target.value)} />
                    </Form.Group>                  
                                                        
                    <Button variant="primary" type="submit"> Create Student </Button>

            </form>
        </div>
    );
}
//
export default CreateStudent

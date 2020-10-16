import { useMutation, useParams } from '@apollo/react-hooks';
// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

//import { loginUser } from '../utils/API';
import Auth from '../utils/auth';
import {LOGIN_USER} from '../utils/mutations';

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // const { email: email, password: password } = useParams();

  //     const { loading, data } = useMutation(LOGIN_USER, {
  //       variables: { email: email, password: password }
  //     });

  //     const authObj = data?.auth || {};
  const [login, {error}] = useMutation(LOGIN_USER);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      
      console.log("our userform data is: ", userFormData);
      //let userEmail = userFormData.email;
      //let userPass = userFormData.password;
      
      const { data } =  await login({
          variables: {...userFormData}
       });
     // const response = await loginUser(userFormData);
      console.log("our login data result is: ", data);

      if (!data.ok) {
        throw new Error('something went wrong!');
      }

      const { token, user } = await data.json();
      console.log("The user is: ",user);
      console.log("The token is: ",token);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;

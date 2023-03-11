import React, { Fragment, useContext, useState } from "react";
import { FormGroup, Input, Form } from "reactstrap";
import AuthContext from '../../login/AuthContext';

  function Register() {

    const [registerdata, setRegisterData] = useState({
        username : '',
        email : '',
        first_name : '',
        last_name : '',
        password : '',
        password2 : ''
    })
    
    const changeHandler = e => {
        setRegisterData({...registerdata, [e.target.name]: e.target.value})
      }

    const { registerUser } = useContext(AuthContext);

    const handleSubmit = async e => {
      e.preventDefault();
      registerUser(registerdata.username, registerdata.email, registerdata.first_name, registerdata.last_name, registerdata.password, registerdata.password2);
  };
    
  return (
    <Fragment>
            <Form onSubmit={handleSubmit} className='text-center'>
                <FormGroup>
                    <Input
                        type="text"
                        name="username"
                        id="username"
                        placeholder='userName'
                        onChange={changeHandler}
                        required
                    />&nbsp; 
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder='email'
                        onChange={changeHandler}
                        required
                    />&nbsp; <br />
                    <Input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder='Firstname'
                        onChange={changeHandler}
                        required
                    />&nbsp; 
                    <Input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder='Lastname'
                        onChange={changeHandler}
                        required
                    />&nbsp; <br />
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder='password'
                        onChange={changeHandler}
                        required
                    />&nbsp; <br />
                    <Input
                        type="password"
                        name="password2"
                        id="password2"
                        placeholder='re-enter password'
                        onChange={changeHandler}
                        required
                    />&nbsp; {registerdata.password2 !== registerdata.password ? "Passwords do not match" : ""}<br />
                    <button type="submit" className="btn" >
                    Create
                    </button>
                    <br />
                </FormGroup>
            </Form>
        </Fragment>
  );
}

export default Register;
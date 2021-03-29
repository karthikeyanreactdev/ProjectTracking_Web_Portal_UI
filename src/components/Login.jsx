import React, { useState } from 'react';
import history from '../util/history';
import axios from 'axios';
import { Button, Form, Container, Jumbotron, Alert } from 'react-bootstrap';
import apiRoot from '../ApiPath';

function Login(props) {

	const [validated, setValidated] = useState(false);
	const [userName, setuserName] = useState("");
	const [password, setpassword] = useState("");
	const [error, seterror] = useState("");


	const handleSubmit = (event) => {
		event.preventDefault();
		const form = event.currentTarget;


		if (form.checkValidity() === false) {
			event.preventDefault();
			setValidated(true)
		}
		else {
			if (validated) {
				loginUser();
			}
		}
	}

	const loginUser = () => {
		let params = {
			username: userName,
			password: password
		}

		axios
			.post(`${apiRoot.url}/login`, params)
			.then(response => response.data)
			.then(
				result => {
					localStorage.setItem('token', JSON.stringify(result.token));

					if (result.data.role === "admin") {
						history.push('/app/AdminPage');
					} else if (result.data.role === "manager") {
						localStorage.setItem('roles', JSON.stringify(["manager"]));
						history.push('/app/ManagerPage');

					}
				},
				err => {
					
					if (err.response.status === 406) {
						seterror('Please enter valid password.')

					} else if (err.response.status === 404) {
						seterror('User name not exists.')

					} else {
						seterror('Please contact admin.')
					}

				}
			)
	}


	return (
		<div>
			<Container bsPrefaix="nc" >

				<Jumbotron className="mt-5">
					<h4 className="d-flex justify-content-center">  LOGIN</h4>
					<Form noValidate validated={validated} onSubmit={handleSubmit} >
						<Form.Group controlId="formBasicEmail">
							<Form.Label>User Name</Form.Label>
							<Form.Control type="text" required placeholder="User Name" name="userName" value={userName} onChange={(e) => { seterror(""); setValidated(true); setuserName(e.target.value) }}
							/>

						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" required placeholder="Password" name="password" value={password} onChange={(e) => { seterror(""); setValidated(true); setpassword(e.target.value) }} />
						</Form.Group>

						<Button
							variant="primary"
							type="submit"
							className="mb-4"
						//onClick={this.handleClick}
						//disabled={userName.length>2 && password.length>2?false:true}
						>
							Login
				</Button>
						{error.length > 0 ? <Alert variant="danger">{error}</Alert> : ''}

					</Form>
					<Alert variant="primary">Admin Credentials -- User Name : Karthikeyan | Password: 1234</Alert>
					<Alert variant="success">Manager Credentials -- User Name : User | Password: 1234</Alert>
				</Jumbotron>
			</Container>
		</div>
	)

}

export default Login;
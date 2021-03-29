import React from 'react';
import { Container, Jumbotron } from 'react-bootstrap';


export default class NotFound extends React.Component {
	render() {
		return (
			<div>
				<Container>
					<Jumbotron className="mt-5 d-flex justify-content-center">
							<h4>You are not authorized to Access this page. Please click Home menu.</h4>
					</Jumbotron>
				</Container>
			
			</div>
		)
	}
}


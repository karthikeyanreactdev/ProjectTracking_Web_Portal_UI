import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { rolesConfig } from '../config/roles';
import * as Routes from './index';
import axios from 'axios';
import Navigation from '../components/Navigation';
import NotFound from '../components/NotFound';
const jwt = require("jsonwebtoken");

class PrivateRoutes extends Component {
	state = { allowedRoutes: [] };

	componentDidMount() {
	
		const token = JSON.parse(localStorage.getItem('token'));
		//appending token on all request to backend for verification
		axios.interceptors.request.use(function (config) {
			config.headers.Authorization = token;
			config.headers.['x-auth-token'] = token;

			return config;
		})
		let allowedRoutes=null
		jwt.verify(token, 'supersecret',  function (err, decoded) {
			if (err) {
				this.props.history.push('/');
				localStorage.removeItem('token');
			} else {
				// role based route pushing.		
				let roles = [decoded.userdata.role];				
				if (roles) {
					roles = [...roles];

					 allowedRoutes = roles.reduce((acc, role) => {
						return [...acc, ...rolesConfig[role].routes];
					}, []);

				} else {
					this.props.history.push('/');
				}
			}
		})
		this.setState({ allowedRoutes });

	}

	render() {
		return (
			<Fragment>
				<Navigation
					routes={this.state.allowedRoutes}
					path={this.props.match.path}
				/>
				<Switch>
					{this.state.allowedRoutes.map((route) => (
						<Route
							exact
							key={route.url}
							component={Routes[route.component]}
							path={`${this.props.match.path}${route.url}`}
						/>
					))}
					<Route component={NotFound} />
				</Switch>
			</Fragment>
		);
	}
}

export default PrivateRoutes;

import React from 'react';
import AdminPage from '../components/AdminPage';
import ManagerPage from '../components/ManagerPage';

// Private routes.
const Admin = () => <AdminPage />;
const Manager = () => <ManagerPage />;

export {
	Admin,
	Manager
};

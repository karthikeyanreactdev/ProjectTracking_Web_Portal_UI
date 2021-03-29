// component's config object.
const components = {
	
	AdminPage: {
		component: 'Admin',
		url: '/AdminPage',
		title: 'Admin Page',
		icon: 'menu',
		module: 1
	},
	ManagerPage: {
		component: 'Manager',
		url: '/ManagerPage',
		title: 'Manager Page',
		icon: 'menu',
		module: 1
	},
};

// modules for grouping.
const modules = {
	0: {
		title: 'Dashboard',
		icon: 'home',
		isExpendable: true
	}
};

// component's access to roles.
const rolesConfig = {
	admin: {
		
		routes: [components.AdminPage]

	},
	manager: {
		routes: [
			components.ManagerPage,			
		]
	},
	
	common: {
		routes: [
			{
				component: 'Home',
				url: '/',
				title: 'Home',
				icon: 'menu',
				module: 1
			},
			
		]
	}
};

export { modules, rolesConfig };

import { Link, Outlet } from 'react-router';

function Navbar() {
	const styles = {
		padding: '12px',
	};
	return (
		<>
			<div style={styles}></div>
			<nav className='navbar navbar-expand-lg navbar-light bg-light fixed-top'>
				<div className='container-fluid'>
					<Link className='navbar-brand' to='/'>
						Dashboard
					</Link>
					<div className='collapse navbar-collapse'>
						<ul className='navbar-nav ms-auto'>
							<li className='nav-item'>
								{' '}
								<Link className='nav-link' to='/'>
									Visualize data
								</Link>{' '}
							</li>
							<li className='nav-item'>
								{' '}
								<Link className='nav-link' to='/studies_manager'>
									Manage the studies
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<Outlet />
		</>
	);
}

export default Navbar;

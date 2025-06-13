import { useContext } from 'react';
import { useNavigate } from 'react-router';

import { ContextRedirectInterval } from '..';

import Alert from '../comps/DisplayComps/Alert';

function Error404Page() {
	// Redirect to the main page
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	const navigate = useNavigate();
	setTimeout(() => {
		navigate('/');
	}, timeRedirectInterval);

	return (
		<div className='container pt-5'>
			{/* Error 404 alert */}
			<Alert
				text={
					'It seems that the page you are seeking does not exists. You will be redirected.'
				}
				color={'secondary'}
			/>
		</div>
	);
}

export default Error404Page;

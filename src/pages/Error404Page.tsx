import React, { useContext } from 'react';
import { useNavigate } from 'react-router';

import Alert from '../comps/DisplayComps/Alert';

import { ContextRedirectInterval } from '..';

function Error404Page() {
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect

	const navigate = useNavigate();
	setTimeout(() => {
		navigate('/');
	}, timeRedirectInterval);

	return (
		<div className='container pt-5'>
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

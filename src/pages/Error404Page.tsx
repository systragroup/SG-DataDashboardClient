import React from 'react';
import { useNavigate } from 'react-router';

import Alert from '../comps/DisplayComps/Alert';

function Error404Page() {
	const navigate = useNavigate();
	setTimeout(() => {
		navigate('/');
	}, 3000);

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

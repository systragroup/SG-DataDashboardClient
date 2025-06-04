import React, { useState, useEffect } from 'react';

import Alert from '../comps/DisplayComps/Alert';
import Card from '../comps/DisplayComps/Card';
import ParseMap from '../comps/DisplayComps/ParseMap';

function Dashboard() {
	// States
	const [dataAPI, setDataAPI] = useState(false);
	const [map, setMap] = useState('');

	// Ask map on mount
	useEffect(() => {
		fetch('/dashboard')
			.then((res) => res.json())
			.then((data) => {
				setDataAPI(true);
				setMap(data.iframe);
			});
	}, []);

	// Display when the data has been retrieved
	if (!dataAPI) {
		return (
			<div className='container pt-5'>
				<Alert text={'Loading...'} color={'secondary'} />
			</div>
		);
	}

	// Main page
	return (
		<div className='container-fluid pt-5'>
			<div className='row'>
				<div className='col-md-3'>
					<Card title={'Inputs'}>Body</Card>
				</div>
				<div className='col-md-9'>
					<Card title={'Map'}>
						<ParseMap map={map} />
					</Card>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;

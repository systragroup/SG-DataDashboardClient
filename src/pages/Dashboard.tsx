import React, { useState, useEffect } from 'react';

import Alert from '../comps/DisplayComps/Alert';
import Card from '../comps/DisplayComps/Card';
import MapParse from '../comps/DisplayComps/MapParse';

function Dashboard() {
	// Alerts
	const [errorAlert, setErrorAlert] = useState(false);

	// States
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	const [map, setMap] = useState(''); // displayed map

	// Ask map on mount
	useEffect(() => {
		fetch('/dashboard')
			.then((res) => res.json())
			.then((data) => {
				setLoadedDataAPI(true);
				setMap(data.iframe);
				// if (data.status === 'success') {
				// 	setLoadedDataAPI(true);
				// 	setMap(data.iframe);
				// } else {
				// 	setErrorAlert(true);
				// }
			});
	}, []);

	// Display when the data has been retrieved
	if (!loadedDataAPI) {
		return (
			<div className='container pt-5'>
				{errorAlert && <Alert text={'Loading...'} color={'secondary'} />}

				{errorAlert && (
					<Alert
						text={'An error has occured, please try again later.'}
						color={'danger'}
					/>
				)}
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
						<MapParse map={map} />
					</Card>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;

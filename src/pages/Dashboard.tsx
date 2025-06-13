import { useState, useEffect } from 'react';

import Alert from '../comps/DisplayComps/Alert';
import Card from '../comps/DisplayComps/Card';
import MapParse from '../comps/DisplayComps/MapParse';

function Dashboard() {
	// Alert states
	const [errorAlert, setErrorAlert] = useState(false); // error at launch

	// Step states
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	// Variable states
	const [map, setMap] = useState(''); // displayed map

	// Ask map on mount
	useEffect(() => {
		fetch('/dashboard')
			.then((res) => res.json())
			.then((data) => {
				setMap(data.iframe);
				setLoadedDataAPI(true);
				if (data.status === 'success') {
					setMap(data.iframe);
					setLoadedDataAPI(true);
				} else {
					setErrorAlert(true);
				}
			});
	}, []);

	// Display when the data has been retrieved
	if (!loadedDataAPI) {
		return (
			<div className='container pt-5'>
				{/* Loading alert */}
				{!errorAlert && <Alert text={'Loading...'} color={'secondary'} />}

				{/* Error at launch alert */}
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
				{/* Inputs */}
				<div className='col-md-3'>
					<Card title={'Inputs'}>Body</Card>
				</div>

				{/* Map */}
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

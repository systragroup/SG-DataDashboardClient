import React, { useState, useEffect } from 'react';

import Alert from '../comps/DisplayComps/Alert';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import Card from '../comps/DisplayComps/Card';
import MapParse from '../comps/DisplayComps/MapParse';
import StudiesList from '../comps/StudiesList';

function StudiesManager() {
	// Alerts
	const [errorAlert, setErrorAlert] = useState(false);

	// States
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	const [map, setMap] = useState(''); // displayed map
	const [studies, setStudies] = useState([
		{ id: 0, name: 'Loading...', visibility: false },
	]); // list of the studies to display

	// Get the map
	useEffect(() => {
		fetch('/studies_manager')
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setLoadedDataAPI(true);
					setMap(data.iframe);
					setStudies(data.studies);
				} else {
					setErrorAlert(true);
				}
			});
	}, []);

	// Display when the data has been retrieved from the API
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
			{errorAlert && (
				<Alert
					text={'An error has occured, please try again later.'}
					color={'danger'}
				/>
			)}

			<div className='row'>
				<div className='col-md-3'>
					<StudiesList
						title={'Studies'}
						desc={'Study visible'}
						list={studies}
						defaultmessage={'No registered studies.'}
						dest={'/study'}
					/>
					<div className='mb-3'>
						<ButtonLink
							text={'Add a study'}
							ref={'/studies_manager/new'}
							color={'primary'}
						/>
					</div>
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

export default StudiesManager;

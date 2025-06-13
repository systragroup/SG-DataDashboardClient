import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContextRedirectInterval } from '..';

import Alert from '../comps/DisplayComps/Alert';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import Card from '../comps/DisplayComps/Card';
import MapParse from '../comps/DisplayComps/MapParse';
import StudiesList from '../comps/ListComps/StudiesList';

function StudiesManager() {
	const navigate = useNavigate();

	// Alert states
	const [errorAlert, setErrorAlert] = useState(false); // error at launch

	// Step states
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	// Variable states
	const [map, setMap] = useState(''); // displayed map
	const [studies, setStudies] = useState([
		{ id: 0, name: 'Loading...', visibility: false },
	]); // list of the studies to display

	// Redirect when unexisting or error
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	useEffect(() => {
		if (errorAlert) {
			setTimeout(() => {
				navigate('/');
			}, timeRedirectInterval);
		}
	}, [errorAlert]);

	// Get the map
	useEffect(() => {
		fetch('/studies_manager')
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setMap(data.iframe);
					setStudies(data.studies);
					setLoadedDataAPI(true);
				} else {
					setErrorAlert(true);
				}
			});
	}, []);

	// Display when the data has been retrieved from the API
	if (!loadedDataAPI) {
		return (
			<div className='container pt-5'>
				{/* Loadint alert */}
				{errorAlert && <Alert text={'Loading...'} color={'secondary'} />}

				{/* Error alert */}
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
					{/* List of the studies */}
					<StudiesList
						title={'Studies'}
						desc={'Study visible'}
						list={studies}
						defaultmessage={'No registered studies.'}
						dest={'/study'}
					/>
					<div className='mb-3'>
						{/* Create a study button */}
						<ButtonLink
							text={'Add a study'}
							ref={'/studies_manager/new'}
							color={'primary'}
						/>
					</div>
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

export default StudiesManager;

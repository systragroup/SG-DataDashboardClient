import React, { useState, useEffect } from 'react';

import Alert from '../comps/DisplayComps/Alert';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import Card from '../comps/DisplayComps/Card';
import ParseMap from '../comps/DisplayComps/ParseMap';
import StudiesList from '../comps/StudiesList';

function StudiesManager() {
	// States
	const [dataAPI, setDataAPI] = useState(false);
	const [map, setMap] = useState('');
	const [studies, setStudies] = useState([
		{ id: 0, name: 'Loading...', visibility: false },
	]);

	// Get the map
	useEffect(() => {
		fetch('/studies_manager')
			.then((res) => res.json())
			.then((data) => {
				setDataAPI(true);
				setMap(data.iframe);
				setStudies(data.studies);
			});
	}, []);

	// Display when the data has been retrieved from the API
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
					<StudiesList
						title={'Studies'}
						desc={'Study visible'}
						list={studies}
						defaultmessage={'No registered studies.'}
						ref={'/study'}
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
						<ParseMap map={map} />
					</Card>
				</div>
			</div>
		</div>
	);
}

export default StudiesManager;

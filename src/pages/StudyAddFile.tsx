import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Alert from '../comps/DisplayComps/Alert';
import Card from '../comps/DisplayComps/Card';
import InputSelector from '../comps/InputsComps/InputSelector';

import None from '../comps/AddFileComps/None';
import Points from '../comps/AddFileComps/Points';
import Subdiv from '../comps/AddFileComps/Subdiv';
import InputFile from '../comps/InputsComps/InputFile';

function StudyAddFile() {
	const navigate = useNavigate();
	const params = useParams();

	// Selector choices
	const selectorChoices = [
		{ value: 'NONE', text: 'Please select a type' },
		{ value: 'SUBDIV', text: 'Add a subdivision into zones' },
		{ value: 'POINTS', text: 'Add a group of points' },
	];

	// Alerts
	const [unexistingAlert, setUnexistingAlert] = useState(false);

	// States
	const [dataAPI, setDataAPI] = useState(false);
	const [studyID, setStudyID] = useState(-1);
	const [studyName, setStudyName] = useState('');
	const [selectedType, setSelectedType] = useState('NONE');

	// Get the data of the study
	useEffect(() => {
		// ID
		const id = params.studyID ? params.studyID : '-1';
		const intID = parseInt(id);
		setStudyID(intID);

		// Data
		fetch(`/study/${intID}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setDataAPI(true);
					setStudyName(data.name);
				} else {
					setUnexistingAlert(true);
					setTimeout(() => {
						navigate('/studies_manager');
					}, 3000);
				}
			});
	}, []);

	// Restrictions on the input file regarding the selected type
	const typeToDesc: { [key: string]: string } = {
		NONE: 'Please select a type of file.',
		SUBDIV:
			'Your file should be a shapefile (.zip containing the .shp, .shx, .dbf, ...), with polygons or multipolygons, each having a name and an integer id.',
		POINTS:
			'Your file should be a shapefile (.zip containing the .shp, .shx, .dbf, ...), with points, each having an integer id.',
	};
	const typeToExt: { [key: string]: string } = {
		NONE: '',
		SUBDIV: '.zip',
		POINTS: '.zip',
	};

	// Submit the form
	const submitForm = (event: any) => {};

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
		<div className='container pt-5'>
			{unexistingAlert && (
				<Alert
					text={'The study does not exists. You will be redirected.'}
					color={'warning'}
				/>
			)}

			<form id='fileForm' onSubmit={(event) => submitForm(event)}>
				<Card title={`Add a file for: ${studyName}`}>
					<InputSelector
						onChangeFunc={(event: any) => setSelectedType(event.target.value)}
						id={'fileSelect'}
						desc={'Select a type of input file'}
						values={selectorChoices}
						defaultValue={'NONE'}
						required={true}
					/>

					{selectedType !== 'NONE' && (
						<InputFile
							id={'fileFile'}
							desc={typeToDesc[selectedType]}
							extensions={typeToExt[selectedType]}
							required={true}
							readonly={false}
						/>
					)}

					{selectedType === 'NONE' && <None />}
					{selectedType === 'SUBDIV' && <Subdiv />}
					{selectedType === 'POINTS' && <Points />}
				</Card>
			</form>
		</div>
	);
}

export default StudyAddFile;

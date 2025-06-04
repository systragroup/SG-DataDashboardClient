import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Alert from '../comps/DisplayComps/Alert';
import Card from '../comps/DisplayComps/Card';
import InputCoordinates from '../comps/InputsComps/InputCoordinates';
import InputLongText from '../comps/InputsComps/InputLongText';
import InputShortText from '../comps/InputsComps/InputShortText';
import { A } from 'react-router/dist/development/register-BkDIKxVz';

function StudyModify() {
	const navigate = useNavigate();
	const params = useParams();

	// Alerts
	const [unexistingAlert, setUnexistingAlert] = useState(false);
	const [loadingAlert, setLoadingAlert] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [errorAlert, setErrorAlert] = useState(false);

	// States
	const [dataAPI, setDataAPI] = useState(false);
	const [studyID, setStudyID] = useState(-1);
	const [studyName, setStudyName] = useState('');
	const [studyLat, setStudyLat] = useState(0);
	const [studyLon, setStudyLon] = useState(0);
	const [studyDesc, setStudyDesc] = useState('');

	// Get the data of the study
	useEffect(() => {
		const id = params.studyID ? params.studyID : '-1';
		const intID = parseInt(id);
		setStudyID(intID);
		fetch(`/study/${intID}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setDataAPI(true);
					setStudyName(data.name);
					setStudyLat(data.lat);
					setStudyLon(data.lon);
					setStudyDesc(data.desc);
				} else {
					setUnexistingAlert(true);
					setTimeout(() => {
						navigate('/studies_manager');
					}, 3000);
				}
			});
	}, []);

	// Submit the modifications
	const submitForm = (event: any) => {
		setLoadingAlert(true);
		event.preventDefault(); // avoid refreshing the page
		const formData = new FormData(event.target);
		fetch(`/study/${studyID}/modify`, {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				setLoadingAlert(false);
				if (data.status === 'success') {
					setSuccessAlert(true);
					setTimeout(() => {
						navigate(`/study/${studyID}`);
					}, 3000);
				} else {
					setErrorAlert(true);
				}
			});
	};

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

			<form id='studyForm' onSubmit={(event) => submitForm(event)}>
				<Card title={`Modifications for: ${studyName}`}>
					<InputShortText
						id={'studyName'}
						desc={'Name of the study'}
						defaultText={studyName}
						required={true}
						readonly={false}
					/>

					<InputLongText
						id={'studyDesc'}
						desc={'Description of the study'}
						defaultText={studyDesc}
						required={false}
						readonly={false}
					/>

					<InputCoordinates
						id={'study'}
						defaultLat={studyLat}
						defaultLon={studyLon}
						required={true}
						readonly={false}
					/>
				</Card>

				{loadingAlert && <Alert text={'Loading...'} color={'primary'} />}

				{successAlert && (
					<Alert
						text={
							'The study has been modified succesfully. You will be redirected.'
						}
						color={'success'}
					/>
				)}

				{errorAlert && (
					<Alert
						text={'An error has occured, please try again later.'}
						color={'danger'}
					/>
				)}

				<button className='btn btn-primary' type='submit'>
					Submit the modifications
				</button>
			</form>
		</div>
	);
}

export default StudyModify;

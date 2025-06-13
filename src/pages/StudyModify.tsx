import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { ContextRedirectInterval } from '..';

import Alert from '../comps/DisplayComps/Alert';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import ButtonSubmit from '../comps/ButtonComps/ButtonSubmit';
import Card from '../comps/DisplayComps/Card';
import InputCoordinates from '../comps/InputsComps/InputCoordinates';
import InputLongText from '../comps/InputsComps/InputLongText';
import InputShortText from '../comps/InputsComps/InputShortText';

function StudyModify() {
	const navigate = useNavigate();
	const params = useParams();

	// Alert states
	const [unexistingAlert, setUnexistingAlert] = useState(false); // unexisting study
	const [errorAlert, setErrorAlert] = useState(false); // error at launch
	const [loadingAlert, setLoadingAlert] = useState(false); // loading after request of modifications
	const [modifySuccessAlert, setModifySuccessAlert] = useState(false); // successful modifications
	const [modifyErrorAlert, setModifyErrorAlert] = useState(false); // unsuccessful modifications

	// Step states
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	// Variable states
	const [studyID, setStudyID] = useState(-1); // data of the study
	const [studyName, setStudyName] = useState('');
	const [studyLat, setStudyLat] = useState(0);
	const [studyLon, setStudyLon] = useState(0);
	const [studyDesc, setStudyDesc] = useState('');

	// Redirect when unexisting or error
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	useEffect(() => {
		if (unexistingAlert || errorAlert) {
			setTimeout(() => {
				navigate('/studies_manager');
			}, timeRedirectInterval);
		}
	}, [unexistingAlert, errorAlert]);

	// Get the data of the study
	useEffect(() => {
		// Get the ID if it exists
		const strStudyID =
			typeof params.studyID === 'string' ? params.studyID : '-1';
		const intStudyID = parseInt(strStudyID) > 0 ? parseInt(strStudyID) : -1;
		setStudyID(intStudyID);

		// Data
		fetch(`/study/${intStudyID}`)
			.then((res) => res.json())
			.then((data) => {
				// Success
				if (data.status === 'success') {
					// Set data
					setStudyName(data.name);
					setStudyLat(data.lat);
					setStudyLon(data.lon);
					setStudyDesc(data.desc);

					// Display
					setLoadedDataAPI(true);

					// Unexisting alert
				} else if (data.status === 'unexisting') {
					setUnexistingAlert(true);

					// Error alert
				} else {
					setErrorAlert(true);
				}
			});
	}, []);

	// Submit the modifications
	function submitForm(event: any) {
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

				// Success
				if (data.status === 'success') {
					setModifySuccessAlert(true);
					setTimeout(() => {
						navigate(`/study/${studyID}`);
					}, timeRedirectInterval);

					// Unexisting alert
				} else if (data.status === 'unexisting') {
					setUnexistingAlert(true);

					// Error alert
				} else {
					setModifyErrorAlert(true);
				}
			});
	}

	// Display when the data has been retrieved from the API
	if (!loadedDataAPI) {
		return (
			<div className='container pt-5'>
				{/* Loading alert */}
				{!unexistingAlert && !errorAlert && (
					<Alert text={'Loading...'} color={'secondary'} />
				)}

				{/* Unexisting study alert */}
				{unexistingAlert && (
					<Alert
						text={'The study does not exist. You will be redirected.'}
						color={'warning'}
					/>
				)}

				{/* Error alert */}
				{errorAlert && (
					<Alert
						text={'An error has occured. Please try again later.'}
						color={'danger'}
					/>
				)}
			</div>
		);
	}

	// Main page
	return (
		<>
			<div className='container pt-5'>
				{/* Button link to the study */}
				<ButtonLink
					text={'← Go back to the study'}
					ref={`/study/${studyID}`}
					color={'secondary'}
				/>

				{/* Main content */}
				<form id='studyForm' onSubmit={(event) => submitForm(event)}>
					<Card title={`Modifications for: ${studyName}`}>
						{/* Name of the study */}
						<InputShortText
							id={'studyName'}
							desc={'Name of the study'}
							defaultText={studyName}
							required={true}
							readonly={false}
						/>

						{/* Description */}
						<InputLongText
							id={'studyDesc'}
							desc={'Description of the study'}
							defaultText={studyDesc}
							required={false}
							readonly={false}
						/>

						{/* Coordinates */}
						<InputCoordinates
							id={'study'}
							defaultLat={studyLat}
							defaultLon={studyLon}
							required={true}
							readonly={false}
						/>
					</Card>

					{/* Loading alert after request of modifications */}
					{loadingAlert && <Alert text={'Loading...'} color={'primary'} />}

					{/* Successful modifications alert */}
					{modifySuccessAlert && (
						<Alert
							text={
								'The study has been modified succesfully. You will be redirected.'
							}
							color={'success'}
						/>
					)}

					{/* Unsuccessful modifications alert */}
					{modifyErrorAlert && (
						<Alert
							text={'An error has occured, please try again later.'}
							color={'danger'}
						/>
					)}

					{/* Submit button */}
					<ButtonSubmit text={'Submit the modifications'} color={'primary'} />
				</form>
			</div>
		</>
	);
}

export default StudyModify;

import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Alert from '../comps/DisplayComps/Alert';
import Card from '../comps/DisplayComps/Card';
import InputCoordinates from '../comps/InputsComps/InputCoordinates';
import InputFile from '../comps/InputsComps/InputFile';
import InputLongText from '../comps/InputsComps/InputLongText';
import InputShortText from '../comps/InputsComps/InputShortText';

import { ContextRedirectInterval } from '..';

function NewStudy() {
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	const navigate = useNavigate();

	// Alerts
	const [loadingAlert, setLoadingAlert] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [errorAlert, setErrorAlert] = useState(false);

	// Submit the form
	function submitForm(event: any) {
		setLoadingAlert(true);
		event.preventDefault(); // avoid refreshing the page
		const formData = new FormData(event.target);
		fetch('/studies_manager/create', {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				setLoadingAlert(false);
				if (data.status === 'success') {
					setSuccessAlert(true);
					setTimeout(() => {
						navigate(`/study/${data.id}`);
					}, timeRedirectInterval);
				} else {
					setErrorAlert(true);
				}
			});
	}

	// Main page
	return (
		<div className='container pt-5'>
			<form id='studyForm' onSubmit={(event) => submitForm(event)}>
				<Card title={'Study information'}>
					<InputShortText
						id={'studyName'}
						desc={'Name of the study'}
						required={true}
						readonly={false}
					/>
					<InputLongText
						id={'studyDesc'}
						desc={'Description'}
						required={false}
						readonly={false}
					/>
					<InputCoordinates id={'study'} required={true} readonly={false} />
					<InputFile
						id={'studyOutline'}
						desc={'Outline file'}
						extensions={'.zip'}
						required={true}
						readonly={false}
					/>
				</Card>

				{loadingAlert && <Alert text={'Loading...'} color={'primary'} />}

				{successAlert && (
					<Alert
						text={
							'The study has been created succesfully. You will be redirected.'
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
					Create the study
				</button>
			</form>
		</div>
	);
}

export default NewStudy;

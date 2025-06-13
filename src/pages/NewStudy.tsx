import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContextRedirectInterval } from '..';

import Alert from '../comps/DisplayComps/Alert';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import ButtonSubmit from '../comps/ButtonComps/ButtonSubmit';
import Card from '../comps/DisplayComps/Card';
import InputCoordinates from '../comps/InputsComps/InputCoordinates';
import InputFile from '../comps/InputsComps/InputFile';
import InputLongText from '../comps/InputsComps/InputLongText';
import InputShortText from '../comps/InputsComps/InputShortText';

function NewStudy() {
	const navigate = useNavigate();

	// Alert states
	const [loadingAlert, setLoadingAlert] = useState(false); // loading after request of the creation
	const [successAlert, setSuccessAlert] = useState(false); // success of the creation
	const [errorAlert, setErrorAlert] = useState(false); // error of the creation

	// Redirect when unexisting or error
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	useEffect(() => {
		if (errorAlert) {
			setTimeout(() => {
				navigate('/studies_manager');
			}, timeRedirectInterval);
		}
	}, [errorAlert]);

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
		<>
			<div className='container pt-5'>
				{/* Button link to the studies manager */}
				<ButtonLink
					text={'← Go back to the studies manager'}
					ref={'/studies_manager'}
					color={'secondary'}
				/>

				{/* Main content */}
				<form id='studyForm' onSubmit={(event) => submitForm(event)}>
					<Card title={'Study information'}>
						{/* Name of the study */}
						<InputShortText
							id={'studyName'}
							desc={'Name of the study'}
							required={true}
							readonly={false}
						/>

						{/* Description */}
						<InputLongText
							id={'studyDesc'}
							desc={'Description'}
							required={false}
							readonly={false}
						/>

						{/* Coordinates */}
						<InputCoordinates id={'study'} required={true} readonly={false} />

						{/* Outline of the study area */}
						<InputFile
							id={'studyOutline'}
							desc={'Shapefile of the outline of the study area'}
							extensions={'.zip'}
							required={true}
							readonly={false}
						/>
					</Card>

					{/* Submit button */}
					<ButtonSubmit text={'Create the study'} color={'primary'} />

					{/* Loading alert after requets of creation of the study */}
					{loadingAlert && <Alert text={'Loading...'} color={'primary'} />}

					{/* Success alert */}
					{successAlert && (
						<Alert
							text={
								'The study has been created succesfully. You will be redirected.'
							}
							color={'success'}
						/>
					)}

					{/* Error alert */}
					{errorAlert && (
						<Alert
							text={'An error has occured, please try again later.'}
							color={'danger'}
						/>
					)}
				</form>
			</div>
		</>
	);
}

export default NewStudy;

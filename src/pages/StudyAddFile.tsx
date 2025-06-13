import { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { ContextRedirectInterval } from '..';

import Alert from '../comps/DisplayComps/Alert';
import ButtonFunction from '../comps/ButtonComps/ButtonFunction';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import ButtonSubmit from '../comps/ButtonComps/ButtonSubmit';
import Card from '../comps/DisplayComps/Card';
import InputFile from '../comps/InputsComps/InputFile';
import InputSelector from '../comps/InputsComps/InputSelector';
import Points from '../comps/AddFileComps/Points';
import Subdiv from '../comps/AddFileComps/Subdiv';

function StudyAddFile() {
	const navigate = useNavigate();
	const params = useParams();

	// Alert states
	const [unexistingAlert, setUnexistingAlert] = useState(false); // unexisting study
	const [errorAlert, setErrorAlert] = useState(false); // error at launch
	const [preProcessBadFileAlert, setPreProcessBadFileAlert] = useState(false); // bad file at pre-process
	const [preProcessBadFileMessage, setPreProcessBadFileMessage] = useState('');
	const [preProcessErrorAlert, setPreProcessErrorAlert] = useState(false); // error at pre-process
	const [processSuccessAlert, setProcessSuccessAlert] = useState(false); // successful add of the file
	const [processBadFileAlert, setProcessBadFileAlert] = useState(false); // bad file at process
	const [processBadFileMessage, setProcessBadFileMessage] = useState('');
	const [processErrorAlert, setProcessErrorAlert] = useState(false); // error at process

	// Step states
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	const [fileSelected, setFileSelected] = useState(false); // check if the file input is completed
	const [preProcessed, setPreProcessed] = useState(false); // check if the file has been pre-processed
	const [completeForm, setCompleteForm] = useState(false); // check if all the headers are selected

	// Variable states
	const [studyID, setStudyID] = useState(-1); // data of the study
	const [studyName, setStudyName] = useState('');

	const [selectedType, setSelectedType] = useState('none'); // the current selected type of input file
	const [columns, setColumns] = useState(['No headers']); // headers of the file

	// Refs
	const refType = useRef<any>('none'); // selected type
	const refFile = useRef<any>(null); // input file

	// Redirect when unexisting or error
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	useEffect(() => {
		if (
			unexistingAlert ||
			errorAlert ||
			preProcessErrorAlert ||
			processErrorAlert
		) {
			setTimeout(() => {
				navigate('/studies_manager');
			}, timeRedirectInterval);
		}
	}, [unexistingAlert, errorAlert, preProcessErrorAlert, processErrorAlert]);

	// Selector choices
	const selectorChoices = [
		{ value: 'none', text: 'Please select a type' },
		{ value: 'subdiv', text: 'Add a subdivision into zones' },
		{ value: 'points', text: 'Add a group of points' },
	];

	// Description of the selection
	const typeToDesc: { [key: string]: string } = {
		none: 'Please select a type of file.',
		subdiv:
			'Your file should be a shapefile (.zip containing the .shp, .shx, .dbf, ...), with polygons or multipolygons, each having a name and an integer id.',
		points:
			'Your file should be a shapefile (.zip containing the .shp, .shx, .dbf, ...), with points, each having an integer id.',
	};

	// Allowed extensions
	const typeToExt: { [key: string]: string } = {
		none: '',
		subdiv: '.zip',
		points: '.zip',
	};

	// Needed headers for each type
	const typeToHeaders: { [key: string]: string[] } = {
		none: [],
		subdiv: ['Geometry', 'Subzone ID', 'Subzone name'],
		points: [''],
	};

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
					setStudyName(data.name);
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

	// Change the file input when selection change
	function handleSelectionChange(event: any) {
		setSelectedType(event.target.value); // change the selected type

		// Set the next steps to false
		setFileSelected(false);
		setPreProcessed(false);
		setCompleteForm(false);

		// Hide the alerts
		setPreProcessBadFileAlert(false);
		setProcessErrorAlert(false);
		setProcessSuccessAlert(false);

		// Empty the file selection
		if (refFile.current) {
			refFile.current.value = null;
		}
	}

	// Show the pre-process button when the file is selected
	function handleFileChange(event: any) {
		// Set the next steps to false
		setPreProcessed(false);
		setCompleteForm(false);

		// Hide the alerts
		setPreProcessBadFileAlert(false);
		setProcessErrorAlert(false);
		setProcessSuccessAlert(false);

		// Check if there is a file
		if (event.target.files.length !== 0) {
			setFileSelected(true);
		} else {
			setFileSelected(false);
		}
	}

	// Pre-process the file
	function handlePreProcess(event: any) {
		// Set the next steps to false
		setCompleteForm(false);

		// Hide the alerts
		setProcessErrorAlert(false);
		setProcessSuccessAlert(false);

		event.preventDefault(); // avoid refreshing the page

		// Request the preprocess
		const formData = new FormData();
		formData.append('fileFile', refFile.current.files[0]);
		fetch(`/study/${studyID}/add_file/${refType.current.value}/preprocess`, {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				// Success
				if (data.status === 'success') {
					setPreProcessBadFileAlert(false);
					setPreProcessed(true);
					setColumns(data.columns);

					// Unexisting alert
				} else if (data.status === 'unexisting') {
					setUnexistingAlert(true);

					// Bad file alert
				} else if (data.status === 'badfile') {
					setPreProcessBadFileMessage(data.message);
					setPreProcessBadFileAlert(true);

					// Error alert
				} else {
					setPreProcessErrorAlert(true);
				}
			});
	}

	// Check the completion of the form
	function checkFormCompletion(headers: string[]) {
		let complete = true;
		headers.forEach((header) => {
			let value = (document.getElementById(header) as HTMLInputElement).value;
			if (value === '-1') {
				complete = false;
			}

			if (complete) {
				setCompleteForm(true);
			} else {
				setCompleteForm(false);
			}
		});
	}

	// Submit the form
	function handleProcess(event: any) {
		// Hide the alerts
		setProcessErrorAlert(false);
		setProcessSuccessAlert(false);

		event.preventDefault(); // avoid refreshing the page

		// Get the selected headers
		const headers = typeToHeaders[refType.current.value];
		const selectedColumns: { [key: string]: string } = {};
		headers.forEach((header) => {
			let value = (document.getElementById(header) as HTMLInputElement).value;
			selectedColumns[header] = columns[parseInt(value)];
		});

		// Send the file to the server with the selected columns
		const formData = new FormData(event.target);
		formData.append('fileFile', refFile.current.files[0]);
		formData.append('fileHeaders', JSON.stringify(selectedColumns));
		fetch(`/study/${studyID}/add_file/${refType.current.value}/process`, {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				// Success
				if (data.status === 'success') {
					const fileID = data.fileID;
					setProcessSuccessAlert(true);
					setTimeout(() => {
						navigate(`/study/${studyID}/${selectedType}/${fileID}`);
					}, timeRedirectInterval);

					// Unexisting alert
				} else if (data.status === 'unexisting') {
					setUnexistingAlert(true);

					// Bad file alert
				} else if (data.status === 'badfile') {
					setProcessBadFileMessage(data.message);
					setProcessBadFileAlert(true);

					// Error alert
				} else {
					setProcessErrorAlert(true);
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
				{/* Unexisting study alert */}
				{unexistingAlert && (
					<Alert
						text={'The study does not exist. You will be redirected.'}
						color={'warning'}
					/>
				)}

				{/* Button link to the study */}
				<ButtonLink
					text={'← Go back to the study'}
					ref={`/study/${studyID}`}
					color={'secondary'}
				/>

				{/* Main content */}
				<form id='fileForm' onSubmit={(event) => handleProcess(event)}>
					<Card title={`Add a file for: ${studyName}`}>
						{/* Type of file selector */}
						<InputSelector
							id={'fileSelect'}
							onChangeFunc={(event: any) => handleSelectionChange(event)}
							ref={refType}
							desc={'Select a type of input file'}
							values={selectorChoices}
							defaultValue={'none'}
							required={true}
						/>

						{/* Input file if type selected */}
						{selectedType !== 'none' && (
							<InputFile
								id={'fileFile'}
								onChangeFunc={(event: any) => handleFileChange(event)}
								ref={refFile}
								desc={typeToDesc[selectedType]}
								extensions={typeToExt[selectedType]}
								required={true}
								readonly={false}
							/>
						)}

						{/* Pre-process button if file selected */}
						{fileSelected && !preProcessed && (
							<ButtonFunction
								text={'Pre-process the file'}
								onClickFunc={(event: any) => handlePreProcess(event)}
								color={'primary'}
								wide={false}
							/>
						)}

						{/* Pre-procces bad file alert */}
						{preProcessBadFileAlert && (
							<Alert
								text={`The file does not fits in the requirements: ${preProcessBadFileMessage}`}
								color={'warning'}
							/>
						)}

						{/* Pre-procces error alert */}
						{preProcessErrorAlert && (
							<Alert
								text={
									'An error has occured while trying to pre-process the file. Please try again later.'
								}
								color={'danger'}
							/>
						)}

						{/* Form type subdiv if pre-processed */}
						{preProcessed && selectedType === 'subdiv' && (
							<Subdiv
								onChangeFunc={() =>
									checkFormCompletion(typeToHeaders['subdiv'])
								}
								columns={columns}
								headers={typeToHeaders['subdiv']}
							/>
						)}

						{/* Form type points if pre-processed */}
						{preProcessed && selectedType === 'points' && <Points />}

						{/* Submit button if form completed */}
						{completeForm && (
							<ButtonSubmit text={'Add the file'} color={'primary'} />
						)}

						{/* Successful add of file alert */}
						{processSuccessAlert && (
							<Alert
								text={
									'The file has been added succesfully. You will be redirected.'
								}
								color={'success'}
							/>
						)}

						{/* Procces bad file alert */}
						{processBadFileAlert && (
							<Alert
								text={`The file does not fits in the requirements: ${processBadFileMessage}`}
								color={'warning'}
							/>
						)}

						{/* Process error alert */}
						{processErrorAlert && (
							<Alert
								text={
									'An error has occured while trying to process the file. Please try again later.'
								}
								color={'danger'}
							/>
						)}
					</Card>
				</form>
			</div>
		</>
	);
}

export default StudyAddFile;

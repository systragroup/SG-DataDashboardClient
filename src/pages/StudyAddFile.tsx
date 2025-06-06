import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Alert from '../comps/DisplayComps/Alert';
import ButtonFunction from '../comps/ButtonComps/ButtonFunction';
import Card from '../comps/DisplayComps/Card';
import InputSelector from '../comps/InputsComps/InputSelector';

import Points from '../comps/AddFileComps/Points';
import Subdiv from '../comps/AddFileComps/Subdiv';
import InputFile from '../comps/InputsComps/InputFile';

import { ContextRedirectInterval } from '..';

function StudyAddFile() {
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	const navigate = useNavigate();
	const params = useParams();

	// Alerts
	const [unexistingAlert, setUnexistingAlert] = useState(false);
	const [preProcessErrorAlert, setPreProcessErrorAlert] = useState(false);
	const [preProcessErrorMessage, setPreProcessErrorMessage] = useState(
		'Please try again later.'
	);
	const [processErrorAlert, setProcessErrorAlert] = useState(false);
	const [processSuccessAlert, setProcessSuccessAlert] = useState(false);

	// States
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	const [studyID, setStudyID] = useState(-1); // data of the study
	const [studyName, setStudyName] = useState('');

	const [selectedType, setSelectedType] = useState('none'); // the current selected type of input file
	const [fileSelected, setFileSelected] = useState(false); // check if the file input is completed
	const [preProcessed, setPreProcessed] = useState(false); // check if the file has been pre-processed
	const [columns, setColumns] = useState(['No headers']); // headers of the file
	const [completeForm, setCompleteForm] = useState(false); // check if all the headers are selected

	// Refs
	const refType = useRef<any>('none'); // selected type
	const refFile = useRef<any>(null); // input file

	// Selector choices
	const selectorChoices = [
		{ value: 'none', text: 'Please select a type' },
		{ value: 'subdiv', text: 'Add a subdivision into zones' },
		{ value: 'points', text: 'Add a group of points' },
	];

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
				if (data.status === 'success') {
					setLoadedDataAPI(true);
					setStudyName(data.name);
				} else {
					setUnexistingAlert(true);
					setTimeout(() => {
						navigate('/studies_manager');
					}, timeRedirectInterval);
				}
			});
	}, []);

	// Change the file input when selection change
	function handleSelectionChange(event: any) {
		setSelectedType(event.target.value);
		setFileSelected(false);
		setPreProcessed(false);
		setCompleteForm(false);
		setPreProcessErrorAlert(false);
		setProcessErrorAlert(false);
		setProcessSuccessAlert(false);
		if (refFile.current) {
			refFile.current.value = null;
		}
	}

	// Restrictions on the input file regarding the selected type
	const typeToDesc: { [key: string]: string } = {
		none: 'Please select a type of file.',
		subdiv:
			'Your file should be a shapefile (.zip containing the .shp, .shx, .dbf, ...), with polygons or multipolygons, each having a name and an integer id.',
		points:
			'Your file should be a shapefile (.zip containing the .shp, .shx, .dbf, ...), with points, each having an integer id.',
	};

	const typeToExt: { [key: string]: string } = {
		none: '',
		subdiv: '.zip',
		points: '.zip',
	};

	// Show the pre-process button when the file is selected
	function handleFileChange(event: any) {
		setPreProcessed(false);
		setCompleteForm(false);
		setPreProcessErrorAlert(false);
		setProcessErrorAlert(false);
		setProcessSuccessAlert(false);
		if (event.target.files.length !== 0) {
			setFileSelected(true);
		} else {
			setFileSelected(false);
		}
	}

	// Pre-process the file
	function handlePreProcess(event: any) {
		setCompleteForm(false);
		setProcessErrorAlert(false);
		setProcessSuccessAlert(false);
		event.preventDefault(); // avoid refreshing the page
		const formData = new FormData();
		formData.append('fileFile', refFile.current.files[0]);
		fetch(`/study/${studyID}/add_file/${refType.current.value}/preprocess`, {
			method: 'POST',
			body: formData,
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setPreProcessed(true);
					setColumns(data.columns);
				} else {
					setPreProcessErrorMessage(data.message);
					setPreProcessErrorAlert(true);
				}
			});
	}

	// Needed headers for each type
	const typeToHeaders: { [key: string]: string[] } = {
		subdiv: ['Geometry', 'Subzone ID', 'Subzone name'],
		points: [''],
	};

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
	function submitForm(event: any) {
		// Reset the alerts
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
				if (data.status === 'success') {
					setProcessSuccessAlert(true);
					setTimeout(() => {
						navigate(`/study/${studyID}`);
					}, timeRedirectInterval);
				} else {
					setProcessErrorAlert(true);
				}
			});
	}

	// Display when the data has been retrieved from the API
	if (!loadedDataAPI) {
		return (
			<div className='container pt-5'>
				{!unexistingAlert && <Alert text={'Loading...'} color={'secondary'} />}

				{unexistingAlert && (
					<Alert
						text={'The study does not exist. You will be redirected.'}
						color={'warning'}
					/>
				)}
			</div>
		);
	}

	// Main page
	return (
		<div className='container pt-5'>
			<form id='fileForm' onSubmit={(event) => submitForm(event)}>
				<Card title={`Add a file for: ${studyName}`}>
					<InputSelector
						id={'fileSelect'}
						onChangeFunc={(event: any) => handleSelectionChange(event)}
						ref={refType}
						desc={'Select a type of input file'}
						values={selectorChoices}
						defaultValue={'none'}
						required={true}
					/>

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

					{fileSelected && !preProcessed && (
						<div className='row mb-3'>
							<div className='col-md-12'>
								<ButtonFunction
									text={'Pre-process the file'}
									onClickFunc={(event: any) => handlePreProcess(event)}
									color={'primary'}
									wide={false}
								/>
							</div>
						</div>
					)}

					{preProcessErrorAlert && (
						<Alert
							text={`An error has occured while trying to pre-process the file. ${preProcessErrorMessage}`}
							color={'danger'}
						/>
					)}

					{preProcessed && selectedType === 'subdiv' && (
						<Subdiv
							onChangeFunc={() => checkFormCompletion(typeToHeaders['subdiv'])}
							columns={columns}
							headers={typeToHeaders['subdiv']}
						/>
					)}

					{preProcessed && selectedType === 'points' && <Points />}

					{processSuccessAlert && (
						<Alert
							text={
								'The file has been added succesfully. You will be redirected.'
							}
							color={'success'}
						/>
					)}

					{processErrorAlert && (
						<Alert
							text={
								'An error has occured while trying to process the file. Please try again later.'
							}
							color={'danger'}
						/>
					)}

					{completeForm && (
						<div className='row mb-3'>
							<div className='col-md-12'>
								<button className='btn btn-primary' type='submit'>
									Submit the file
								</button>
							</div>
						</div>
					)}
				</Card>
			</form>
		</div>
	);
}

export default StudyAddFile;

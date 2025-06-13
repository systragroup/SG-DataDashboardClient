import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { ContextRedirectInterval } from '..';

import Alert from '../comps/DisplayComps/Alert';
import ButtonFunction from '../comps/ButtonComps/ButtonFunction';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import Card from '../comps/DisplayComps/Card';
import ConfirmModal from '../comps/DisplayComps/ConfirmModal';
import FilesList from '../comps/ListComps/FilesList';
import InputCoordinates from '../comps/InputsComps/InputCoordinates';
import InputLongText from '../comps/InputsComps/InputLongText';
import MapParse from '../comps/DisplayComps/MapParse';

function Study() {
	const navigate = useNavigate();
	const params = useParams();

	// Alert states
	const [unexistingAlert, setUnexistingAlert] = useState(false); // unexisting study
	const [errorAlert, setErrorAlert] = useState(false); // error at launch
	const [visibilitySuccessAlert, setVisibilitySuccessAlert] = useState(false); // change of the visibility successful
	const [visibilityErrorAlert, setVisibilityErrorAlert] = useState(false); // cahnge of the visibility unsuccessful
	const [deletedAlert, setDeletedAlert] = useState(false); // study deleted

	// Step states
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	// Variable states
	const [studyID, setStudyID] = useState(-1); // data of the study
	const [studyName, setStudyName] = useState('');
	const [studyLat, setStudyLat] = useState(0);
	const [studyLon, setStudyLon] = useState(0);
	const [studyDesc, setStudyDesc] = useState('');
	const [studyVisibility, setStudyVisibility] = useState(false);

	const [map, setMap] = useState(''); // displayed map
	const [types, setTypes] = useState([]); // array with the types
	const [files, setFiles] = useState({ '': { 0: '' } }); // object with key types value object (key id value name of the files)

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
			.then((data1) => {
				if (data1.status === 'success') {
					// Map
					fetch(`/study/${intStudyID}/map`)
						.then((res) => res.json())
						.then((data2) => {
							if (data2.status === 'success') {
								// List of files
								fetch(`/study/${intStudyID}/files`)
									.then((res) => res.json())
									.then((data3) => {
										if (data3.status === 'success') {
											// Set the data
											setStudyName(data1.name);
											setStudyLat(data1.lat);
											setStudyLon(data1.lon);
											setStudyDesc(data1.desc);
											setStudyVisibility(data1.visibility);
											setMap(data2.iframe);
											setTypes(data3.types);
											setFiles(data3.files);

											// Display the page
											setLoadedDataAPI(true);

											// Unexisting alert
										} else if (data3.status === 'unexisting') {
											setUnexistingAlert(true);

											// Error alert
										} else {
											setErrorAlert(true);
										}
									});

								// Unexisting alert
							} else if (data2.status === 'unexisting') {
								setUnexistingAlert(true);

								// Error alert
							} else {
								setErrorAlert(true);
							}
						});

					// Unexisting alert
				} else if (data1.status === 'unexisting') {
					setUnexistingAlert(true);

					// Error alert
				} else {
					setErrorAlert(true);
				}
			});
	}, []);

	// Change the visibility of the study
	const [modalVisibility, setModalVisibility] = useState(false);
	function toggleVisibility() {
		fetch(`/study/${studyID}/visibility`, { method: 'POST' })
			.then((res) => res.json())
			.then((data) => {
				// Close the modal
				setModalVisibility(false);

				// Success
				if (data.status === 'success') {
					setStudyVisibility(data.visibility);
					setVisibilitySuccessAlert(true);
					setTimeout(() => {
						setVisibilitySuccessAlert(false);
					}, timeRedirectInterval);

					// Unexisting alert
				} else if (data.status === 'unexisting') {
					setUnexistingAlert(true);

					// Error alert
				} else {
					setStudyVisibility(data.visibility);
					setVisibilityErrorAlert(true);
					setTimeout(() => {
						setVisibilityErrorAlert(false);
					}, timeRedirectInterval);
				}
			});
	}

	// Delete the study
	const [modalDelete, setModalDelete] = useState(false);
	function handleDelete() {
		fetch(`/study/${studyID}/delete`, { method: 'POST' })
			.then((res) => res.json())
			.then((data) => {
				// Close the modal
				setModalDelete(false);

				// Success
				if (data.status === 'success') {
					setDeletedAlert(true);
					setTimeout(() => {
						navigate('/studies_manager');
					}, timeRedirectInterval);

					// Unexisting alert
				} else if (data.status === 'unexisting') {
					setUnexistingAlert(true);
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
			{/* Change visibility modal */}
			<ConfirmModal
				show={modalVisibility}
				title={studyVisibility ? 'Make private' : 'Make public'}
				text={
					studyVisibility
						? 'Are you sure you want to make the study private? The clients will not be able to view it.'
						: 'Are you sure you want to make the study public? The clients will be able to view it.'
				}
				cancelFunc={() => {
					setModalVisibility(false);
				}}
				confirmFunc={toggleVisibility}
			/>

			{/* Delete the study modal */}
			<ConfirmModal
				show={modalDelete}
				title={'Delete the study'}
				text={`Are you sure you want to delete the study? Once deleted, you cannot go back.`}
				cancelFunc={() => {
					setModalDelete(false);
				}}
				confirmFunc={handleDelete}
			/>

			<div className='container pt-5'>
				{/* Unexisting study alert */}
				{unexistingAlert && (
					<Alert
						text={'The study does not exist. You will be redirected.'}
						color={'warning'}
					/>
				)}

				{/* Change of visibility successful alert */}
				{visibilitySuccessAlert && (
					<Alert
						text={'The visibility of the study has changed successfuly.'}
						color={'info'}
					/>
				)}

				{/* Change of visibility unsuccessful alert */}
				{visibilityErrorAlert && (
					<Alert
						text={
							'Cannot change the visibility of the study. Please try again later.'
						}
						color={'info'}
					/>
				)}

				{/* Deletion of the study alert */}
				{deletedAlert && (
					<Alert
						text={
							'The study has been deleted successfuly. You will be redirected.'
						}
						color={'info'}
					/>
				)}

				{/* Button link to the studies manager*/}
				<ButtonLink
					text={'← Go back to the studies manager'}
					ref={`/studies_manager`}
					color={'secondary'}
				/>

				{/* Main content */}
				<Card title={studyName}>
					{/* Buttons */}
					<div className='row'>
						{/* Add a file */}
						<div className='col-md-3'>
							<ButtonLink
								text={'Add a file'}
								ref={`add_file`}
								color={'primary'}
								wide={true}
							/>
						</div>

						{/* Change visibility */}
						<div className='col-md-3'>
							{studyVisibility ? (
								<ButtonFunction
									text={'Make private'}
									onClickFunc={() => {
										setModalVisibility(true);
									}}
									color={'primary'}
									wide={true}
								/>
							) : (
								<ButtonFunction
									text={'Make public'}
									onClickFunc={() => {
										setModalVisibility(true);
									}}
									color={'warning'}
									wide={true}
								/>
							)}
						</div>

						{/* Modify the study */}
						<div className='col-md-3'>
							<ButtonLink
								text={'Modify the study'}
								ref={`modify`}
								color={'warning'}
								wide={true}
							/>
						</div>

						{/* Delete the study */}
						<div className='col-md-3'>
							<ButtonFunction
								text={'Delete the study'}
								onClickFunc={() => {
									setModalDelete(true);
								}}
								color={'danger'}
								wide={true}
							/>
						</div>
					</div>

					{/* Description */}
					<InputLongText
						id={'studyDesc'}
						desc={'Description of the study'}
						defaultText={studyDesc}
						required={false}
						readonly={true}
					/>

					{/* Coordinates */}
					<InputCoordinates
						id={'study'}
						defaultLat={studyLat}
						defaultLon={studyLon}
						required={false}
						readonly={true}
					/>

					{/* Map */}
					<MapParse map={map} />

					{/* Files */}
					{types.map((type) => (
						<FilesList
							title={`Files of type ${type}`}
							list={files[type]}
							dest={`/study/${studyID}/${type}`}
						/>
					))}
				</Card>
			</div>
		</>
	);
}

export default Study;

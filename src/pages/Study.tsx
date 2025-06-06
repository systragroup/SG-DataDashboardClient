import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Alert from '../comps/DisplayComps/Alert';
import ButtonFunction from '../comps/ButtonComps/ButtonFunction';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import Card from '../comps/DisplayComps/Card';
import FilesList from '../comps/FilesList';
import ConfirmModal from '../comps/DisplayComps/ConfirmModal';
import InputCoordinates from '../comps/InputsComps/InputCoordinates';
import InputLongText from '../comps/InputsComps/InputLongText';
import MapParse from '../comps/DisplayComps/MapParse';

import { ContextRedirectInterval } from '..';

function Study() {
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	const navigate = useNavigate();
	const params = useParams();

	// Alerts
	const [unexistingAlert, setUnexistingAlert] = useState(false);
	const [visibilitySuccessAlert, setVisibilitySuccessAlert] = useState(false);
	const [visibilityErrorAlert, setVisibilityErrorAlert] = useState(false);
	const [deletedAlert, setDeletedAlert] = useState(false);

	// States
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	const [studyID, setStudyID] = useState(-1); // data of the study
	const [studyName, setStudyName] = useState('');
	const [studyLat, setStudyLat] = useState(0);
	const [studyLon, setStudyLon] = useState(0);
	const [studyDesc, setStudyDesc] = useState('');
	const [studyVisibility, setStudyVisibility] = useState(false);

	const [map, setMap] = useState(''); // displayed map
	const [types, setTypes] = useState([]); // array with the types
	const [files, setFiles] = useState({ '': { 0: '' } }); // object with key types value object (key id value name of the files)

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
					setStudyName(data.name);
					setStudyLat(data.lat);
					setStudyLon(data.lon);
					setStudyDesc(data.desc);
					setStudyVisibility(data.visibility);

					// Map
					fetch(`/study/${intStudyID}/map`)
						.then((res) => res.json())
						.then((data2) => {
							if (data2.status === 'success') {
								setMap(data2.iframe);

								// List of files
								fetch(`/study/${intStudyID}/files`)
									.then((res) => res.json())
									.then((data3) => {
										if (data3.status === 'success') {
											setLoadedDataAPI(true);
											setTypes(data3.types);
											setFiles(data3.files);
										} else {
											setUnexistingAlert(true);
											setTimeout(() => {
												navigate('/studies_manager');
											}, timeRedirectInterval);
										}
									});
							} else {
								setUnexistingAlert(true);
								setTimeout(() => {
									navigate('/studies_manager');
								}, timeRedirectInterval);
							}
						});
				} else {
					setUnexistingAlert(true);
					setTimeout(() => {
						navigate('/studies_manager');
					}, timeRedirectInterval);
				}
			});
	}, []);

	// Change the visibility of the study
	const [modalVisibility, setModalVisibility] = useState(false);
	function toggleVisibility() {
		fetch(`/study/${studyID}/visibility`, { method: 'POST' })
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setModalVisibility(false);
					setVisibilitySuccessAlert(true);
					setStudyVisibility(data.visibility);
					setTimeout(() => {
						setVisibilitySuccessAlert(false);
					}, timeRedirectInterval);
				} else {
					setModalVisibility(false);
					setVisibilityErrorAlert(true);
					setStudyVisibility(data.visibility);
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
				if (data.status === 'success') {
					setModalDelete(false);
					setDeletedAlert(true);
					setTimeout(() => {
						navigate('/studies_manager');
					}, timeRedirectInterval);
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
		<>
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
				{visibilitySuccessAlert && (
					<Alert
						text={'The visibility of the study has changed successfuly.'}
						color={'info'}
					/>
				)}

				{visibilityErrorAlert && (
					<Alert
						text={
							'Cannot change the visibility of the study. Please try again later.'
						}
						color={'info'}
					/>
				)}

				{deletedAlert && (
					<Alert
						text={
							'The study has been deleted successfuly. You will be redirected.'
						}
						color={'danger'}
					/>
				)}

				<Card title={studyName}>
					<div className='row mb-3'>
						<div className='col-md-3'>
							<ButtonLink
								text={'Add a file'}
								ref={`add_file`}
								color={'primary'}
								wide={true}
							/>
						</div>
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
						<div className='col-md-3'>
							<ButtonLink
								text={'Modify the study'}
								ref={`modify`}
								color={'warning'}
								wide={true}
							/>
						</div>
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

					<InputLongText
						id={'studyDesc'}
						desc={'Description of the study'}
						defaultText={studyDesc}
						required={false}
						readonly={true}
					/>

					<InputCoordinates
						id={'study'}
						defaultLat={studyLat}
						defaultLon={studyLon}
						required={false}
						readonly={true}
					/>

					<MapParse map={map} />

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

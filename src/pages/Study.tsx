import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Alert from '../comps/DisplayComps/Alert';
import ButtonFunction from '../comps/ButtonComps/ButtonFunction';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import Card from '../comps/DisplayComps/Card';
import ConfirmModal from '../comps/DisplayComps/ConfirmModal';
import InputCoordinates from '../comps/InputsComps/InputCoordinates';
import InputLongText from '../comps/InputsComps/InputLongText';
import ParseMap from '../comps/DisplayComps/ParseMap';

function Study() {
	const navigate = useNavigate();
	const params = useParams();

	// Alerts
	const [unexistingAlert, setUnexistingAlert] = useState(false);
	const [visibilityAlert, setVisibilityAlert] = useState(false);
	const [deletedAlert, setDeletedAlert] = useState(false);

	// States
	const [dataAPI, setDataAPI] = useState(false);
	const [studyID, setStudyID] = useState(-1);
	const [studyName, setStudyName] = useState('');
	const [studyLat, setStudyLat] = useState(0);
	const [studyLon, setStudyLon] = useState(0);
	const [studyDesc, setStudyDesc] = useState('');
	const [studyVisibility, setStudyVisibility] = useState(false);
	const [map, setMap] = useState('');

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
					setStudyName(data.name);
					setStudyLat(data.lat);
					setStudyLon(data.lon);
					setStudyDesc(data.desc);
					setStudyVisibility(data.visibility);

					// Map
					fetch(`/study/${intID}/map`)
						.then((res) => res.json())
						.then((data2) => {
							if (data2.status === 'success') {
								setDataAPI(true);
								setMap(data2.iframe);
							} else {
								setUnexistingAlert(true);
								setTimeout(() => {
									navigate('/studies_manager');
								}, 3000);
							}
						});
				} else {
					setUnexistingAlert(true);
					setTimeout(() => {
						navigate('/studies_manager');
					}, 3000);
				}
			});
	}, []);

	// Change the visibility of the study
	const [modalVisibility, setModalVisibility] = useState(false);
	const toggleVisibility = () => {
		fetch(`/study/${studyID}/visibility`, { method: 'POST' })
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setModalVisibility(false);
					setVisibilityAlert(true);
					setStudyVisibility(data.visibility);
					setTimeout(() => {
						setVisibilityAlert(false);
					}, 3000);
				}
			});
	};

	// Delete the study
	const [modalDelete, setModalDelete] = useState(false);
	const handleDelete = () => {
		fetch(`/study/${studyID}/delete`, { method: 'POST' })
			.then((res) => res.json())
			.then((data) => {
				if (data.status === 'success') {
					setModalDelete(false);
					setDeletedAlert(true);
					setTimeout(() => {
						navigate('/studies_manager');
					}, 3000);
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
				text={`${studyID} Are you sure you want to delete the study? Once deleted, you cannot go back.`}
				cancelFunc={() => {
					setModalDelete(false);
				}}
				confirmFunc={handleDelete}
			/>

			<div className='container pt-5'>
				{unexistingAlert && (
					<Alert
						text={'The study does not exists. You will be redirected.'}
						color={'warning'}
					/>
				)}

				{visibilityAlert && (
					<Alert
						text={'The visibility of the study has changed successfuly.'}
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

					<ParseMap map={map} />
				</Card>
			</div>
		</>
	);
}

export default Study;

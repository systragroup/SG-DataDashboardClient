import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { ContextRedirectInterval } from '..';

import Alert from '../comps/DisplayComps/Alert';
import ButtonFunction from '../comps/ButtonComps/ButtonFunction';
import ButtonLink from '../comps/ButtonComps/ButtonLink';
import Card from '../comps/DisplayComps/Card';
import CleanUncleanList from '../comps/ListComps/CleanUncleanList';
import ConfirmModal from '../comps/DisplayComps/ConfirmModal';
import MapParse from '../comps/DisplayComps/MapParse';

function FileSubdiv() {
	const navigate = useNavigate();
	const params = useParams();

	// Alert states
	const [unexistingAlert, setUnexistingAlert] = useState(false); // unexisting file or study
	const [errorAlert, setErrorAlert] = useState(false); // error at launch
	const [deleteSuccessAlert, setDeleteSuccessAlert] = useState(false); // the file has been deleted successfully
	const [deleteErrorAlert, setDeleteErrorAlert] = useState(false);

	// Step states
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	const [setEvent, setSetEvent] = useState(0); // change to launch the add of the event listeners

	// Variable states
	const [studyID, setStudyID] = useState(-1); // data of the study
	const [fileID, setFileID] = useState(-1);
	const [fileName, setFileName] = useState('');
	const [map, setMap] = useState('');
	const [mapName, setMapName] = useState('');
	const [zonesClean, setZonesClean] = useState<any>('');
	const [zonesUnclean, setZonesUnclean] = useState<any>('');

	const [selectedZone, setSelectedZone] = useState(-3); // data to send back when requesting a new map
	const [center, setCenter] = useState();
	const [zoom, setZoom] = useState();

	// Redirect when unexisting or error
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	useEffect(() => {
		if (unexistingAlert || errorAlert || deleteErrorAlert) {
			setTimeout(() => {
				navigate('/studies_manager');
			}, timeRedirectInterval);
		}
	}, [unexistingAlert, errorAlert, deleteErrorAlert]);

	// Get the ids
	useEffect(() => {
		// Get the study ID if it exists
		const strStudyID =
			typeof params.studyID === 'string' ? params.studyID : '-1';
		const intStudyID = parseInt(strStudyID) > 0 ? parseInt(strStudyID) : -1;
		setStudyID(intStudyID);

		// Get the file ID if it exists
		const strFileID = typeof params.fileID === 'string' ? params.fileID : '-1';
		const intFileID = parseInt(strFileID) > 0 ? parseInt(strFileID) : -1;
		setFileID(intFileID);

		// Request the display of the first map
		setSelectedZone((s) => -2);
	}, []);

	// Display the map and change it when the selected zone changes
	useEffect(() => {
		// Wait for the first request
		if (selectedZone > -3) {
			// Define the starting position and zoom
			let data;
			if (zoom === undefined) {
				data = JSON.stringify({ first_map: true });
			} else {
				// Data
				data = JSON.stringify({
					first_map: false,
					selected: selectedZone,
					center: center,
					zoom: zoom,
				});
			}

			// Get the map
			fetch(`/study/${studyID}/subdiv/${fileID}`, {
				method: 'POST',
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.status === 'success') {
						// Set the data
						setFileName(data.fileName);
						setMap(data.iframe);
						setMapName(data.mapName);
						setZonesClean(data.zonesClean);
						setZonesUnclean(data.zonesUnclean);

						// Display the page and set up the event listeners
						setLoadedDataAPI(true);
						setSetEvent((e) => e + 1);

						// Unexisting alert
					} else if (data.status === 'unexisting') {
						setUnexistingAlert(true);

						// Error alert
					} else {
						setErrorAlert(true);
					}
				});
		}
	}, [selectedZone]);

	// Wait for the layer to be loaded
	function waitForLayer(
		id: any,
		window: any,
		callback: any,
		attempts = 10,
		intervalMs = 200
	) {
		let tries = 0;
		const interval = setInterval(() => {
			const layer = window[id];
			if (layer && layer.getElement && layer.getElement()) {
				clearInterval(interval);
				callback(layer);
			} else if (++tries >= attempts) {
				clearInterval(interval);
				console.error(`Layer ${id} not found or no DOM element`);
			}
		}, intervalMs);
	}

	// Add the event listener when loadEvent request it
	useEffect(() => {
		// Wait for the first request
		if (setEvent > 0) {
			// Get the window
			const iframe = document.getElementById('mapDisplay') as HTMLIFrameElement;
			const mapWindow = iframe.contentWindow as any;

			// Loop through the dict to create the event listeners
			Object.keys(zonesClean).forEach((id: any) => {
				zonesClean[id].geometry.forEach((key: any) => {
					// Wait for the layer of the element to load
					waitForLayer(key, mapWindow, (layer: any) => {
						// Get the element and set up the event listener
						const element = layer.getElement();
						element.addEventListener('click', () => {
							const map = mapWindow[mapName];
							// Get the current center and zoom of the map
							setSelectedZone(id);
							setCenter(map.getCenter());
							setZoom(map.getZoom());
						});
					});
				});
			});
		}
	}, [setEvent]);

	// Delete the file
	const [modalDelete, setModalDelete] = useState(false);
	function handleDeleteFile() {
		fetch(`/study/${studyID}/subdiv/${fileID}/delete`, { method: 'POST' })
			.then((res) => res.json())
			.then((data) => {
				// Close the modal
				setModalDelete(false);

				// Success
				if (data.status === 'success') {
					setDeleteSuccessAlert(true);
					setTimeout(() => {
						navigate(`/study/${studyID}`);
					}, timeRedirectInterval);

					// Unexisting alert
				} else if (data.status === 'unexisting') {
					setUnexistingAlert(true);

					// Error alert
				} else {
					setDeleteErrorAlert(true);
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

				{/* Unexisting study or file alert */}
				{unexistingAlert && (
					<Alert
						text={
							'The study or the file does not exist. You will be redirected.'
						}
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
			{/* Delete the study modal */}
			<ConfirmModal
				show={modalDelete}
				title={'Delete the file'}
				text={`Are you sure you want to delete the file? Once deleted, you cannot go back.`}
				cancelFunc={() => {
					setModalDelete(false);
				}}
				confirmFunc={handleDeleteFile}
			/>

			<div className='container pt-5'>
				{/* Unexisting study alert */}
				{unexistingAlert && (
					<Alert
						text={
							'The study or the file does not exist. You will be redirected.'
						}
						color={'warning'}
					/>
				)}

				{/* Deletion of the study successful alert */}
				{deleteSuccessAlert && (
					<Alert
						text={
							'The file has been deleted successfuly. You will be redirected.'
						}
						color={'info'}
					/>
				)}

				{/* Deletion of the study unsuccessful alert */}
				{deleteErrorAlert && (
					<Alert
						text={'Cannot delete the file. Please try again later.'}
						color={'danger'}
					/>
				)}

				{/* Button link to the study */}
				<ButtonLink
					text={'← Go back to the study'}
					ref={`/study/${studyID}`}
					color={'secondary'}
				/>

				{/* Main content */}
				<Card title={fileName}>
					{/* Delete button */}
					<ButtonFunction
						text={'Delete the file'}
						onClickFunc={() => {
							setModalDelete(true);
						}}
						color={'danger'}
					/>

					{/* Map */}
					<MapParse map={map} onChangeFunc={() => setSetEvent((e) => e++)} />

					{/* List of zones */}
					<CleanUncleanList
						title={'Zones'}
						cleanList={zonesClean}
						uncleanList={zonesUnclean}
						selected={selectedZone}
						setSelected={setSelectedZone}
					/>
				</Card>
			</div>
		</>
	);
}

export default FileSubdiv;

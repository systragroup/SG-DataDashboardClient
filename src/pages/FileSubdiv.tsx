import React, { useEffect, useState, useContext } from 'react';
import parse from 'html-react-parser';
import { Form, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import Alert from '../comps/DisplayComps/Alert';
import Card from '../comps/DisplayComps/Card';
import MapParse from '../comps/DisplayComps/MapParse';

import { ContextRedirectInterval } from '..';

function FileSubdiv() {
	const timeRedirectInterval = useContext(ContextRedirectInterval); // time before redirect
	const navigate = useNavigate();
	const params = useParams();

	// Alerts
	const [unexistingAlert, setUnexistingAlert] = useState(false);

	// States
	const [loadedDataAPI, setLoadedDataAPI] = useState(false); // check if the data from the API are loaded

	const [studyID, setStudyID] = useState(-1); // data of the study
	const [fileID, setFileID] = useState(-1);
	const [fileName, setFileName] = useState('');
	const [map, setMap] = useState('');
	const [mapName, setMapName] = useState('');
	const [zones, setZones] = useState<any>('');

	const [loadMap, setLoadMap] = useState(0); // launch the fetch of the map
	const [setEvent, setSetEvent] = useState(0); // launch the add of the event listener

	const [selectedZone, setSelectedZone] = useState();
	const [center, setCenter] = useState();
	const [zoom, setZoom] = useState();

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

	// Set up the event listeners
	function setEventListeners() {
		// Get the window
		const iframe = document.getElementById('mapDisplay') as HTMLIFrameElement;
		const mapWindow = iframe.contentWindow as any;

		// Loop through the dict to create the event listeners
		Object.keys(zones).forEach((id: any) => {
			zones[id].geometry.forEach((key: any) => {
				// Wait for the layer of the element to load
				waitForLayer(key, mapWindow, (layer: any) => {
					// Get the element and set up the event listener
					const element = layer.getElement();
					element.addEventListener('click', () => {
						// Get the current center and zoom of the map
						const map = mapWindow[mapName];
						setSelectedZone(id);
						setCenter(map.getCenter());
						setZoom(map.getZoom());
						setLoadMap((m) => m + 1);
					});
				});
			});
		});
	}

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

		// Launch the display of the next map
		setLoadMap((m) => m + 1);
	}, []);

	// Display the map and change when loadMap request it
	useEffect(() => {
		// Wait for the first launch to have the IDs
		if (loadMap > 0) {
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
						setMapName(data.mapName);
						setMap(data.iframe);
						setZones(data.zones);
						setLoadedDataAPI(true);
						setSetEvent((e) => e + 1);
					} else {
						setUnexistingAlert(true);
						setTimeout(() => {
							navigate('/studies_manager');
						}, timeRedirectInterval);
					}
				});
		}
	}, [loadMap]);

	// Add the event listener when loadEvent request it
	useEffect(() => {
		// Wait for the first map to be loaded
		if (setEvent > 0) {
			setEventListeners();
		}
	}, [setEvent]);

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
			<Card title={fileName}>
				<MapParse map={map} onChangeFunc={() => setSetEvent((e) => e++)} />
			</Card>
		</div>
	);
}

export default FileSubdiv;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './pages/Dashboard';
import Error404Page from './pages/Error404Page';
import Navbar from './pages/Navbar';
import NewStudy from './pages/NewStudy';
import StudiesManager from './pages/StudiesManager';
import Study from './pages/Study';
import StudyAddFile from './pages/StudyAddFile';
import StudyModify from './pages/StudyModify';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Navbar />}>
					<Route index element={<Dashboard />} />
					<Route path='studies_manager' element={<StudiesManager />} />
					<Route path='studies_manager/new' element={<NewStudy />} />
					<Route path='study/:studyID' element={<Study />} />
					<Route path='study/:studyID/add_file' element={<StudyAddFile />} />
					<Route path='study/:studyID/modify' element={<StudyModify />} />
					<Route path='*' element={<Error404Page />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

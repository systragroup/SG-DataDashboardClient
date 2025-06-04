import React from 'react';
import parse from 'html-react-parser';

interface ParseMapProps {
	map: string;
}

function ParseMap({ map }: ParseMapProps) {
	return <div className='row mb-3'>{parse(map)}</div>;
}

export default ParseMap;

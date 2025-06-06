import React from 'react';
import parse from 'html-react-parser';

interface MapParseProps {
	map: string;
	onChangeFunc?: () => void;
}

function MapParse({ map, onChangeFunc }: MapParseProps) {
	return (
		<div className='row mb-3' onChange={onChangeFunc}>
			{parse(map)}
		</div>
	);
}

export default MapParse;

import React from 'react';

import InputSelectHeader from '../InputsComps/InputSelectHeader';
import InputShortText from '../InputsComps/InputShortText';

interface SubdivProps {
	onChangeFunc: () => void;
	headers: string[];
	columns: string[];
}

function Subdiv({ onChangeFunc, headers, columns }: SubdivProps) {
	return (
		<>
			<InputShortText
				id={'fileName'}
				desc={'Desired name'}
				required={true}
				readonly={false}
			/>
			<div className='row mb-3' onChange={onChangeFunc}>
				<div className='col-md-12'>
					Please fill the corresponding column for each requested header *
					<ul className='list-group'>
						{headers.map((header) => (
							<li className='list-group-item' key={header}>
								<InputSelectHeader header={header} columns={columns} />
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
}

export default Subdiv;

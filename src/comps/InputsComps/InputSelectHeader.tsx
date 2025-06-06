import React, { useRef } from 'react';

interface InputSelectHeaderProps {
	header: string;
	columns: string[];
}

function InputSelectHeader({ header, columns }: InputSelectHeaderProps) {
	return (
		<div className='row'>
			<div className='d-flex align-items-center'>
				<div className='col-md-3'>{header}</div>
				<div className='col-md-9'>
					<select id={header} className='form-select' defaultValue={-1}>
						<option value={-1} key={-1}>
							Select
						</option>
						{columns.map((col, ind) => (
							<option value={ind} key={ind}>
								{col}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}

export default InputSelectHeader;

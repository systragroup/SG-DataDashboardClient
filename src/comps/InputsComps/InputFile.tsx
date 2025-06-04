import React from 'react';

interface InputCoordinatesProps {
	id: string;
	desc: string;
	extensions: string;
	required: boolean;
	readonly: boolean;
}

function InputFile({
	id,
	desc,
	extensions,
	required,
	readonly,
}: InputCoordinatesProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				<label htmlFor={id}>
					{desc} {`(${extensions})`} {required && '*'}
				</label>
				<input
					className='form-control'
					type='file'
					accept={extensions}
					id={id}
					name={id}
					required={required}
					readOnly={readonly}
				/>
			</div>
		</div>
	);
}

export default InputFile;

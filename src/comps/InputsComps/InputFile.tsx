import React from 'react';

interface InputFileProps {
	id: string;
	onChangeFunc?: (event: any) => void;
	ref?: any;
	desc: string;
	extensions: string;
	required: boolean;
	readonly: boolean;
}

function InputFile({
	id,
	onChangeFunc,
	ref,
	desc,
	extensions,
	required,
	readonly,
}: InputFileProps) {
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
					onChange={onChangeFunc}
					ref={ref}
					required={required}
					readOnly={readonly}
				/>
			</div>
		</div>
	);
}

export default InputFile;

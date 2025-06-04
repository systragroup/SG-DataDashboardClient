import React from 'react';

interface InputLongTextProps {
	id: string;
	desc: string;
	defaultText?: string;
	required: boolean;
	readonly: boolean;
}

function InputLongText({
	id,
	desc,
	defaultText,
	required,
	readonly,
}: InputLongTextProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				<label htmlFor={id}>
					{desc} {required && '*'}
				</label>
				<textarea
					className='form-control'
					id={id}
					name={id}
					defaultValue={defaultText}
					cols={50}
					rows={4}
					required={required}
					readOnly={readonly}
				/>
			</div>
		</div>
	);
}

export default InputLongText;

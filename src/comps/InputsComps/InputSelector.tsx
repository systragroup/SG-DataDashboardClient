import React from 'react';

interface InputSelectorProps {
	onChangeFunc: (event: any) => void;
	id: string;
	desc: string;
	values: { value: string; text: string }[];
	defaultValue: string;
	required: boolean;
}

function InputSelector({
	onChangeFunc,
	id,
	desc,
	values,
	defaultValue,
	required,
}: InputSelectorProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				<label htmlFor={id}>
					{desc} {required && '*'}
				</label>
				<select
					className='form-control'
					onChange={onChangeFunc}
					id={id}
					name={id}
					defaultValue={defaultValue}
					required={required}
				>
					{values.map((el) => (
						<option value={el.value}>{el.text}</option>
					))}
				</select>
			</div>
		</div>
	);
}

export default InputSelector;

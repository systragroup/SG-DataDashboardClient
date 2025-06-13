interface InputSelectorProps {
	id: string;
	onChangeFunc?: (event: any) => void;
	ref?: any;
	desc: string;
	values: { value: string; text: string }[];
	defaultValue?: string;
	required: boolean;
}

function InputSelector({
	id,
	onChangeFunc,
	ref,
	desc,
	values,
	defaultValue,
	required,
}: InputSelectorProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				{/* Label */}
				<label htmlFor={id}>
					{desc} {required && '*'}
				</label>

				{/* Selector */}
				<select
					className='form-control'
					style={{ borderColor: 'rgb(200, 200, 200)' }}
					id={id}
					name={id}
					onChange={onChangeFunc}
					ref={ref}
					defaultValue={defaultValue}
					required={required}
				>
					{/* Values */}
					{values.map((el) => (
						<option key={el.value} value={el.value}>
							{el.text}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

export default InputSelector;

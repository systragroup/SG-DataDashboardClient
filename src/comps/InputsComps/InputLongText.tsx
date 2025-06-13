interface InputLongTextProps {
	id: string;
	onChangeFunc?: (event: any) => void;
	ref?: any;
	desc: string;
	defaultText?: string;
	required: boolean;
	readonly: boolean;
}

function InputLongText({
	id,
	onChangeFunc,
	ref,
	desc,
	defaultText,
	required,
	readonly,
}: InputLongTextProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				{/* Label */}
				<label htmlFor={id}>
					{desc} {required && '*'}
				</label>

				{/* Text input */}
				<textarea
					className='form-control'
					style={{ borderColor: 'rgb(200, 200, 200)' }}
					id={id}
					name={id}
					onChange={onChangeFunc}
					ref={ref}
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

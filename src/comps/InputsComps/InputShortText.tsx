interface InputShortTextProps {
	id: string;
	onChangeFunc?: (event: any) => void;
	ref?: any;
	desc: string;
	defaultText?: string;
	required: boolean;
	readonly: boolean;
}

function InputShortText({
	id,
	onChangeFunc,
	ref,
	desc,
	defaultText,
	required,
	readonly,
}: InputShortTextProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				{/* Label */}
				<label htmlFor={id}>
					{desc} {required && '*'}
				</label>

				{/* Text input */}
				<input
					className='form-control'
					style={{ borderColor: 'rgb(200, 200, 200)' }}
					type='text'
					id={id}
					name={id}
					onChange={onChangeFunc}
					ref={ref}
					defaultValue={defaultText}
					required={required}
					readOnly={readonly}
				/>
			</div>
		</div>
	);
}

export default InputShortText;

interface InputCoordinatesProps {
	id: string;
	onChangeFunc?: (event: any) => void;
	refLat?: any;
	refLon?: any;
	defaultLat?: number;
	defaultLon?: number;
	required: boolean;
	readonly: boolean;
}

function InputCoordinates({
	id,
	onChangeFunc,
	refLat,
	refLon,
	defaultLat,
	defaultLon,
	required,
	readonly,
}: InputCoordinatesProps) {
	return (
		<div className='row mb-3'>
			{/* Latitude */}
			<div className='col-md-6'>
				<label htmlFor={`${id}Lat`}>Latitude {required && '*'}</label>
				<input
					className='form-control'
					style={{ borderColor: 'rgb(200, 200, 200)' }}
					type='number'
					id={`${id}Lat`}
					name={`${id}Lat`}
					onChange={onChangeFunc}
					ref={refLat}
					defaultValue={defaultLat}
					step={'0.000001'}
					min={'-90'}
					max={'90'}
					required={required}
					readOnly={readonly}
				/>
			</div>

			{/* Longitude */}
			<div className='col-md-6'>
				<label htmlFor={`${id}Lon`}>Longitude {required && '*'}</label>
				<input
					className='form-control'
					style={{ borderColor: 'rgb(200, 200, 200)' }}
					type='number'
					id={`${id}Lon`}
					name={`${id}Lon`}
					onChange={onChangeFunc}
					ref={refLon}
					defaultValue={defaultLon}
					step={'0.000001'}
					min={'-180'}
					max={'180'}
					required={required}
					readOnly={readonly}
				/>
			</div>
		</div>
	);
}

export default InputCoordinates;

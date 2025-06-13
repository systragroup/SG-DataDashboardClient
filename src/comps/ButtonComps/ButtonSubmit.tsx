interface ButtonSubmitProps {
	text: string;
	color:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'danger'
		| 'warning'
		| 'info'
		| 'light'
		| 'dark'
		| 'link';
	wide?: boolean;
}

function ButtonSubmit({ text, color, wide = false }: ButtonSubmitProps) {
	// Wide button
	if (wide) {
		return (
			<div className='row mb-3'>
				<div className='col-mb-12'>
					<div className='row mx-1'>
						<button className={`btn btn-${color}`} type='submit'>
							{text}
						</button>
					</div>
				</div>
			</div>
		);

		// Regular button
	} else {
		return (
			<div className='row mb-3'>
				<div className='col-mb-12'>
					<button className={`btn btn-${color}`} type='submit'>
						{text}
					</button>
				</div>
			</div>
		);
	}
}

export default ButtonSubmit;

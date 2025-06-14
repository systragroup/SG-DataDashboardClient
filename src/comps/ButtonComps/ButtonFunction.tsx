interface ButtonFunctionProps {
	text: string;
	onClickFunc: (event: any) => void;
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

function ButtonFunction({
	text,
	onClickFunc,
	color,
	wide = false,
}: ButtonFunctionProps) {
	// Wide button
	if (wide) {
		return (
			<div className='row mb-3'>
				<div className='col-mb-12'>
					<div className='row mx-1'>
						<button className={`btn btn-${color}`} onClick={onClickFunc}>
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
					<button className={`btn btn-${color}`} onClick={onClickFunc}>
						{text}
					</button>
				</div>
			</div>
		);
	}
}

export default ButtonFunction;

interface InputSelectHeaderProps {
	header: string;
	columns: string[];
}

function InputSelectHeader({ header, columns }: InputSelectHeaderProps) {
	return (
		<li
			className='list-group-item'
			style={{ borderColor: 'rgb(200, 200, 200)' }}
			key={header}
		>
			<div className='row'>
				<div className='d-flex align-items-center'>
					{/* Header */}
					<div className='col-md-3'>{header}</div>

					{/* Column selector */}
					<div className='col-md-9'>
						<select
							className='form-select'
							style={{ borderColor: 'rgb(200, 200, 200)' }}
							id={header}
							defaultValue={-1}
						>
							<option value={-1} key={-1}>
								Select
							</option>
							{columns.map((col, ind) => (
								<option value={ind} key={ind}>
									{col}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</li>
	);
}

export default InputSelectHeader;

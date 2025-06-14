interface AlertProps {
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
}

function Alert({ text, color }: AlertProps) {
	return (
		<div className='row'>
			<div className='col-md-12'>
				<div className={`alert alert-${color}`} role='alert'>
					{text}
				</div>
			</div>
		</div>
	);
}

export default Alert;

import React from 'react';

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
		<div className={`alert alert-${color} mb-3`} role='alert'>
			{text}
		</div>
	);
}

export default Alert;

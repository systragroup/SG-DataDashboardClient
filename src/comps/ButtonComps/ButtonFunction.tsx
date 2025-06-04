import React from 'react';
import { Link } from 'react-router';

interface ButtonFunctionProps {
	text: string;
	onClickFunc: () => void;
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
	if (wide) {
		return (
			<div className='row mx-1'>
				<button className={`btn btn-${color}`} onClick={onClickFunc}>
					{text}
				</button>
			</div>
		);
	} else {
		return (
			<button className={`btn btn-${color}`} onClick={onClickFunc}>
				{text}
			</button>
		);
	}
}

export default ButtonFunction;

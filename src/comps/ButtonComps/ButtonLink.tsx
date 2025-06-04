import React from 'react';
import { Link } from 'react-router';

interface ButtonLinkProps {
	text: string;
	ref: string;
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

function ButtonLink({ text, ref, color, wide = false }: ButtonLinkProps) {
	if (wide) {
		return (
			<Link to={ref} style={{ textDecoration: 'none' }}>
				<div className='row mx-1'>
					<button className={`btn btn-${color}`}>{text}</button>
				</div>
			</Link>
		);
	} else {
		return (
			<Link to={ref} style={{ textDecoration: 'none' }}>
				<button className={`btn btn-${color}`}>{text}</button>
			</Link>
		);
	}
}

export default ButtonLink;

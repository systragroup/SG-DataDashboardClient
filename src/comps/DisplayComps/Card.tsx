import React, { ReactNode } from 'react';

interface CardProps {
	title: string;
	children: ReactNode;
}

function Card({ title, children }: CardProps) {
	return (
		<div className='card mb-3'>
			<div className='card-header'>
				<div className='row m-1'>{title}</div>
			</div>
			<div className='card-body'>
				<div className={'row'}>{children}</div>
			</div>
		</div>
	);
}

export default Card;

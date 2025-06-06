import React, { ReactNode } from 'react';

interface CardProps {
	title: string;
	children: ReactNode;
}

function Card({ title, children }: CardProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				<div className='card mb-3'>
					<div className='card-header'>
						<div className='row m-1'>{title}</div>
					</div>
					<div
						className='card-body'
						style={{ marginBottom: -12, marginRight: -24 }}
					>
						<div className={'row'}>{children}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Card;

import { ReactNode } from 'react';

interface CardProps {
	title: string;
	children: ReactNode;
}

function Card({ title, children }: CardProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				<div className='card' style={{ borderColor: 'rgb(200, 200, 200)' }}>
					{/* Header */}
					<div
						className='card-header'
						style={{ backgroundColor: 'rgb(225, 225, 225)' }}
					>
						<div className='row m-1'>{title}</div>
					</div>

					{/* Body */}
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

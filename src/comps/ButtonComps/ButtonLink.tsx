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
	// Wide button
	if (wide) {
		return (
			<Link to={ref} style={{ textDecoration: 'none' }}>
				<div className='row mb-3'>
					<div className='col-mb-12'>
						<div className='row mx-1'>
							<button className={`btn btn-${color}`}>{text}</button>
						</div>
					</div>
				</div>
			</Link>
		);

		// Regular button
	} else {
		return (
			<Link to={ref} style={{ textDecoration: 'none' }}>
				<div className='row mb-3'>
					<div className='col-mb-12'>
						<button className={`btn btn-${color}`}>{text}</button>
					</div>
				</div>
			</Link>
		);
	}
}

export default ButtonLink;

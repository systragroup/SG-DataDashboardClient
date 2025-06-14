import { Link } from 'react-router';

interface StudyElementProps {
	id: number;
	name: string;
	checked: boolean;
	dest: string;
}

function StudyElement({ id, name, checked, dest }: StudyElementProps) {
	return (
		<li className='list-group-item' key={id}>
			<Link to={dest} style={{ textDecoration: 'none', color: 'black' }}>
				<div className='row m-1'>
					<div className='d-flex justify-content-between'>
						<div className='col-md-2'>{id}</div>
						<div className='col-md-7'>{name}</div>
						<div className='col-md-3'>
							<div className='d-flex justify-content-center'>
								<span className='align-middle'>
									<input type='checkbox' checked={checked} disabled />
								</span>
							</div>
						</div>
					</div>
				</div>
			</Link>
		</li>
	);
}

interface StudiesListProps {
	title: string;
	desc: string;
	list: { id: number; name: string; visibility: boolean }[];
	defaultmessage: string;
	dest: string;
}

function StudiesList({
	title,
	desc,
	list,
	defaultmessage,
	dest,
}: StudiesListProps) {
	return (
		<div className='row mb-3'>
			<div className='col-md-12'>
				<div className='card' style={{ borderColor: 'rgb(200, 200, 200)' }}>
					{/* Header */}
					<div
						className='card-header'
						style={{ backgroundColor: 'rgb(225, 225, 225)' }}
					>
						<div className='row m-1'>
							<div className='d-flex justify-content-between'>
								<div className='col-md-2'>#</div>
								<div className='col-md-7'>{title}</div>
								<div className='col-md-3'>
									<div className='d-flex justify-content-center'>{desc}</div>
								</div>
							</div>
						</div>
					</div>

					{/* List of the studies */}
					<ul className='list-group list-group-flush'>
						{list.length === 0 && (
							<li className='list-group-item'>{defaultmessage}</li>
						)}
						{list.map((el) => (
							<StudyElement
								id={el.id}
								name={el.name}
								checked={el.visibility}
								dest={`${dest}/${el.id}`}
							/>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default StudiesList;

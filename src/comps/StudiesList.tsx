import React from 'react';
import { Link } from 'react-router';

interface CardProps {
	title: string;
	desc: string;
	list: { id: number; name: string; visibility: boolean }[];
	defaultmessage: string;
	ref: string;
}

function StudyElement(id: number, name: string, checked: boolean, ref: string) {
	return (
		<li className='list-group-item' key={id}>
			<Link to={ref} style={{ textDecoration: 'none', color: 'black' }}>
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

function StudiesList({ title, desc, list, defaultmessage, ref }: CardProps) {
	return (
		<div className='card mb-3'>
			<div className='card-header'>
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
			<ul className='list-group list-group-flush'>
				{list.length === 0 && (
					<li className='list-group-item'>{defaultmessage}</li>
				)}
				{list.map((el) =>
					StudyElement(el.id, el.name, el.visibility, `${ref}/${el.id}`)
				)}
			</ul>
		</div>
	);
}

export default StudiesList;

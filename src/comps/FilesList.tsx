import React from 'react';
import { Link } from 'react-router';

interface FileElementProps {
	id: number;
	name: string;
	dest: string;
}

function FileElement({ id, name, dest }: FileElementProps) {
	return (
		<li className='list-group-item' key={id}>
			<Link to={dest} style={{ textDecoration: 'none', color: 'black' }}>
				<div>{`${id} - ${name}`}</div>
			</Link>
		</li>
	);
}

interface CardListProps {
	title: string;
	list: {};
	dest: string;
}

function FilesList({ title, list, dest }: CardListProps) {
	return (
		<div className='row'>
			<div className='col-md-12'>
				<div className='card mb-3'>
					<div className='card-header'>
						<div className='row m-1'>{title}</div>
					</div>
					<ul className='list-group list-group-flush'>
						{Object.entries(list).map((el: any) => (
							<FileElement id={el[0]} name={el[1]} dest={`${dest}/${el[0]}`} />
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default FilesList;

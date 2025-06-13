interface CleanUncleanElementProps {
	id: number;
	name: string;
	clean: boolean;
	selected: number;
	setSelected: any;
}

function CleanUncleanElement({
	id,
	name,
	clean,
	selected,
	setSelected,
}: CleanUncleanElementProps) {
	return (
		<li
			className={`list-group-item ${id === selected ? 'active' : ''}`}
			key={id}
			style={clean ? {} : { backgroundColor: 'rgb(255, 200, 200)' }}
			onClick={() => setSelected(id)}
		>
			<div className='row'>
				<div className='col-md-1'>{id}</div>
				<div className='col-md-11'>{name}</div>
			</div>
		</li>
	);
}

interface CleanUncleanProps {
	title: string;
	cleanList: {};
	uncleanList: {};
	selected: any;
	setSelected: any;
}

function CleanUncleanList({
	title,
	cleanList,
	uncleanList,
	selected,
	setSelected,
}: CleanUncleanProps) {
	if (Object.keys(cleanList).length + Object.keys(uncleanList).length === 0) {
		return <></>;
	} else {
		return (
			<div className='row mb-3'>
				<div className='col-md-12'>
					<div className='card' style={{ borderColor: 'rgb(200, 200, 200)' }}>
						<div
							className='card-header'
							style={{ backgroundColor: 'rgb(225, 225, 225)' }}
						>
							<div className='row'>
								<div className='col-md-1'>#</div>
								<div className='col-md-11'>{title}</div>
							</div>
						</div>
						<ul className='list-group list-group-flush'>
							{Object.entries(cleanList).map((el: any) => (
								<CleanUncleanElement
									id={el[0]}
									name={el[1]['name']}
									clean={true}
									selected={selected}
									setSelected={setSelected}
								/>
							))}
							{Object.entries(uncleanList).map((el: any) => (
								<CleanUncleanElement
									id={el[0]}
									name={el[1]['name']}
									clean={false}
									selected={selected}
									setSelected={setSelected}
								/>
							))}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

export default CleanUncleanList;

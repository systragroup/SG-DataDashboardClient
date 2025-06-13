import Modal from 'react-bootstrap/Modal';

import ButtonFunction from '../ButtonComps/ButtonFunction';

interface ConfirmModalProps {
	show: boolean;
	title: string;
	text: string;
	cancelFunc: () => void;
	confirmFunc: () => void;
}

function ConfirmModal({
	show,
	title,
	text,
	cancelFunc,
	confirmFunc,
}: ConfirmModalProps) {
	return (
		<Modal show={show} onHide={cancelFunc}>
			{/* Header */}
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>

			{/* Body */}
			<Modal.Body>{text}</Modal.Body>

			{/* Buttons */}
			<Modal.Footer>
				<ButtonFunction
					text={'Cancel'}
					onClickFunc={cancelFunc}
					color={'secondary'}
				/>
				<ButtonFunction
					text={'Confirm'}
					onClickFunc={confirmFunc}
					color={'danger'}
				/>
			</Modal.Footer>
		</Modal>
	);
}

export default ConfirmModal;

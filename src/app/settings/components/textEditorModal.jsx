import { useState } from 'react'
import { Button, Modal } from 'flowbite-react'
import TextEditor from '../../components/textEditor'

export default function TextEditorModal({
	name,
	value,
	onChange,
	showTextEditorModal,
	setShowTextEditorModal,
}) {
	// content to edit default value is that is present already in the field
	const [content, setContent] = useState(value)

	return (
		<Modal
			size='3xl'
			dismissible={false}
			show={showTextEditorModal}
			onClose={() => setShowTextEditorModal(false)}
		>
			<Modal.Header>{name}</Modal.Header>

			<Modal.Body>
				<TextEditor content={content} setContent={setContent} />
			</Modal.Body>

			<Modal.Footer>
				<Button
					onClick={() => {
						onChange(content)
						setShowTextEditorModal(false)
					}}
				>
					Save
				</Button>
				<Button color='gray' onClick={() => setShowTextEditorModal(false)}>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	)
}

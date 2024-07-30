import CKEditor from "react-ckeditor-component";

export default function TextEditor({ content, setContent }) {
	const handleChange = (event) => {
		setContent(event.editor.getData());
	};

	return (
		<CKEditor
			activeClass="p10"
			content={content}
			events={{
				// blur: this.onBlur,
				// afterPaste: this.afterPaste,
				change: handleChange,
			}}
		/>
	);
}

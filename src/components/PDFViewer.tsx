type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
	return (
		<iframe
			src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
			className="h-full w-full"
			title="PDF Viewer"
		/>
	);
};

export default PDFViewer;

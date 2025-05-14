"use client";

import { Inbox } from "lucide-react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"application/pdf": [".pdf"]
		},
		maxFiles: 1,
		onDrop: (acceptedFiles) => {
			// Handle file upload
			console.log(acceptedFiles);
		}
	});
	return (
		<div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur-md">
			<div
				{...getRootProps({
					className:
						"border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
				})}
			>
				<input {...getInputProps()} />
				<Inbox className="h-10 w-10 text-blue-500" />
				<p className="mt-2 text-slate-400 text-sm">Drop PDF Here</p>
			</div>
			<h2 className="font-semibold text-gray-700 text-xl">
				Upload your PDF to get started
			</h2>
			{/* Replace below with your actual uploader */}
			<div className="mt-2 text-gray-500 text-sm italic">
				[PDF Upload Component]
			</div>
		</div>
	);
};

export default FileUpload;

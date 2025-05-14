"use client";

import { uploadToS3 } from "@/lib/s3";
import { Inbox } from "lucide-react";
import { useDropzone } from "react-dropzone";

const FileUpload = () => {
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"application/pdf": [".pdf"]
		},
		maxFiles: 1,
		onDrop: async (acceptedFiles) => {
			// Handle file upload
			console.log(acceptedFiles);

			const file = acceptedFiles[0];

			if (file.size > 10 * 1024 * 1024) {
				// bigger than 10MB!
				alert("File size exceeds 10MB");

				return;
			}

			try {
				const data = await uploadToS3(file);

				console.log("data", data);
			} catch (err) {
				console.error("Error uploading file", err);
				alert("Error uploading file");
			}
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

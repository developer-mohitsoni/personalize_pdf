"use client";

import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const FileUpload = () => {
	const [uploading, setUploading] = useState(false);
	const { mutate, isPending } = useMutation({
		mutationFn: async ({
			file_key,
			file_name
		}: { file_key: string; file_name: string }) => {
			const response = await axios.post("/api/create-chat", {
				file_key,
				file_name
			});

			return response.data;
		}
	});
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

				toast.error("File size exceeds 10MB");

				return;
			}

			try {
				setUploading(true);
				const data = await uploadToS3(file);

				if (!data?.file_key || !data.file_name) {
					toast.error("Something went wrong");
					return;
				}

				mutate(data, {
					onSuccess: (data) => {
						console.log(data);
						// toast.success("Chat created successfully");
						toast.success(data.message);
					},
					onError: (err) => {
						console.log(err);
						toast.error("Error creating chat");
					}
				});

				console.log("data", data);
			} catch (err) {
				toast.error("Error uploading file");
			} finally {
				setUploading(false);
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
				{uploading || isPending ? (
					<>
						{/* Loading State */}
						<Loader2 className="h-10 w-10 animate-spin text-blue-500" />
						<p className="mt-2 text-slate-400 text-sm">
							Spilling Tea to GPT...
						</p>
					</>
				) : (
					<>
						<Inbox className="h-10 w-10 text-blue-500" />
						<p className="mt-2 text-slate-400 text-sm">Drop PDF Here</p>
					</>
				)}
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

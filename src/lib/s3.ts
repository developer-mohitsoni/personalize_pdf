// s3-client.ts - SECURE VERSION using Pre-signed URLs
export async function uploadToS3(file: File) {
	try {
		// Step 1: Get pre-signed URL from your API
		const response = await fetch("/api/s3/presigned-url", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				fileName: file.name,
				fileType: file.type
			})
		});

		if (!response.ok) {
			throw new Error("Failed to get pre-signed URL");
		}

		const { presignedUrl, fileKey } = await response.json();

		// Step 2: Upload directly to S3 using pre-signed URL
		const uploadResponse = await fetch(presignedUrl, {
			method: "PUT",
			headers: {
				"Content-Type": file.type
			},
			body: file
		});

		if (!uploadResponse.ok) {
			throw new Error("Failed to upload file to S3");
		}

		console.log("Successfully uploaded file to S3!", fileKey);

		return Promise.resolve({
			file_key: fileKey,
			file_name: file.name
		});
	} catch (err) {
		console.error("Error uploading file to S3", err);
		return Promise.reject(err);
	}
}

export function getS3URL(file_key: string) {
	const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
	const region = process.env.NEXT_PUBLIC_S3_REGION;
	const url = `https://${bucketName}.s3.${region}.amazonaws.com/${file_key}`;
	return url;
}
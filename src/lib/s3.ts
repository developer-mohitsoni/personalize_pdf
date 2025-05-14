import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
	try {
		AWS.config.update({
			accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
			secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
		});

		const s3 = new AWS.S3({
			params: {
				Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
			},
			region: process.env.NEXT_PUBLIC_S3_REGION
		});

		const file_key = `uploads/${Date.now().toString()}${file.name.replace(" ", "-")}`;

		const params = {
			Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME as string,
			Key: file_key,
			Body: file
		};

		const upload = s3
			.putObject(params)
			.on("httpUploadProgress", (evt) => {
				`${console.log(
					"uploading to s3...",
					Number.parseInt(((evt.loaded * 100) / evt.total).toString())
				)}%`; // Log the progress of the upload
			})
			.promise();

		await upload.then((data) => {
			console.log("Successfully uploaded file to S3!", file_key);
		});

		return Promise.resolve({
			file_key,
			file_name: file.name
		});
	} catch (err) {
		console.error("Error uploading file to S3", err);
		return Promise.reject(err);
	}
}

export function getS3URL(file_key: string) {
	const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`;

	return url;
}

import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

// Create the S3 client
const client = new S3Client({
	region: process.env.S3_REGION as string,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
	}
});

export async function downloadFromS3(file_key: string): Promise<string> {
	try {
		const command = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME,
			Key: file_key
		});

		const response = await client.send(command);

		if (!response.Body) {
			throw new Error("S3 response body is empty");
		}

		// Convert the Body to a Node.js readable stream
		const stream = response.Body.transformToWebStream
			? Readable.fromWeb(response.Body.transformToWebStream() as any)
			: (response.Body as unknown as Readable); // fallback for Node <18

		// Ensure tmp dir exists
		const tmpDir = "/tmp"; // Use /tmp for universally writable temporary files in Docker
		if (!fs.existsSync(tmpDir)) {
			fs.mkdirSync(tmpDir, { recursive: true }); // Ensure recursive creation
		}

		const filePath = path.join(tmpDir, `pdf-${Date.now()}.pdf`);
		const writeStream = fs.createWriteStream(filePath);

		await new Promise<void>((resolve, reject) => {
			stream.pipe(writeStream).on("error", reject).on("finish", resolve);
		});

		return filePath;
	} catch (err) {
		console.error("Error downloading file from S3", err);
		throw new Error("Failed to download file from S3");
	}
}

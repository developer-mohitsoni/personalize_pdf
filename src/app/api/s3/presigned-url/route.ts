import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextRequest, NextResponse } from "next/server";

// Create S3 client with server-side credentials
const s3Client = new S3Client({
	region: process.env.S3_REGION as string,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
	}
});

export async function POST(request: NextRequest) {
	try {
		const { fileName, fileType } = await request.json();

		// Generate unique file key
		const fileKey = `uploads/${Date.now().toString()}-${fileName.replace(/\s+/g, "-")}`;

		// Create pre-signed URL for PUT operation
		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET_NAME as string,
			Key: fileKey,
			ContentType: fileType
		});

		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600 // URL expires in 1 hour
		});

		return NextResponse.json({
			presignedUrl,
			fileKey
		});
	} catch (error) {
		console.error("Error generating pre-signed URL:", error);
		return NextResponse.json(
			{ error: "Failed to generate pre-signed URL" },
			{ status: 500 }
		);
	}
}

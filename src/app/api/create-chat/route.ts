import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3URL } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { userId } = await auth();

	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const body = await req.json();
		const { file_key, file_name } = body;

		if (!file_key || !file_name) {
			return NextResponse.json(
				{ error: "File key and file name are required" },
				{ status: 400 }
			);
		}

		console.log("file_key", file_key);
		console.log("file_name", file_name);

		await loadS3IntoPinecone(file_key);

		const chat_id = await db
			.insert(chats)
			.values({
				fileKey: file_key,
				pdfName: file_name,
				pdfUrl: getS3URL(file_key),
				userId
			})
			.returning({
				insertedId: chats.id
			});

		return NextResponse.json(
			{
				chat_id: chat_id[0].insertedId
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error("Error in create-chat API", err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

		const pages = await loadS3IntoPinecone(file_key);

		return NextResponse.json({ pages });
	} catch (err) {
		console.error("Error in create-chat API", err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

import { getDb } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (req: Request) => {
	const db = getDb();

	const { chatId } = await req.json();

	const _messages = await db
		.select()
		.from(messages)
		.where(eq(messages.chatId, chatId));

	return NextResponse.json(_messages);
};

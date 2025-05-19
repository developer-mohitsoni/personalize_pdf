import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();

		const result = await streamText({
			model: openai("gpt-3.5-turbo"),
			messages
		});

		return result.toDataStreamResponse();
	} catch (err) {
		console.error(err);
		return new Response("Internal Server Error", { status: 500 });
	}
}

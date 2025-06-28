import { internalHandleSubscription } from "@/lib/razorpay/subscription";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}
	const userId = user.id;
	try {
		const result = await internalHandleSubscription(userId);
		return new Response(JSON.stringify(result), {
			headers: { "Content-Type": "application/json" }
		});
	} catch (error: any) {
		console.error("Error handling subscription:", error);
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
}

export async function GET(request: Request) {
	return new Response("Hello from Razorpay!", { status: 200 });
}

import { getDb } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { getRazorpayClient } from "@/lib/razorpay";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
	try {
		const razorpay = getRazorpayClient();
		const db = getDb();

		const { userId } = await auth();
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const isPro = await checkSubscription();

		if (!isPro) {
			return new NextResponse("Not a Pro user", { status: 400 });
		}

		const _userSubscriptions = await db
			.select()
			.from(userSubscriptions)
			.where(eq(userSubscriptions.userId, userId));

		if (!_userSubscriptions[0]) {
			return new NextResponse("No subscription found", { status: 404 });
		}

		const userSubscription = _userSubscriptions[0];
		const subscriptionId = userSubscription.razorpaySubscriptionId;

		if (!subscriptionId) {
			return new NextResponse("No subscription ID found", { status: 404 });
		}

		// Cancel the subscription using Razorpay API
		await razorpay.subscriptions.cancel(subscriptionId);

		// Update the subscription status in the database
		await db
			.update(userSubscriptions)
			.set({
				razorpayCurrentPeriodEnd: null
			})
			.where(eq(userSubscriptions.userId, userId));

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error cancelling subscription:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

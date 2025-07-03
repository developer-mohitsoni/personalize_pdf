import { getDb } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const db = getDb();

		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ isPro: false, subscriptionId: null });
		}

		const isPro = await checkSubscription();

		const _userSubscriptions = await db
			.select()
			.from(userSubscriptions)
			.where(eq(userSubscriptions.userId, userId));

		if (!_userSubscriptions[0]) {
			return NextResponse.json({ isPro: false, subscriptionId: null });
		}

		const userSubscription = _userSubscriptions[0];
		const subscriptionId = userSubscription.razorpaySubscriptionId;

		return NextResponse.json({ isPro, subscriptionId });
	} catch (error) {
		console.error("Error checking subscription status:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

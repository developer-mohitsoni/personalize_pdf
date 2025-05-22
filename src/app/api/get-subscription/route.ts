import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID as string;
const key_secret = process.env.RAZORPAY_KEY_SECRET as string;

const razorpay = new Razorpay({ key_id, key_secret });

export async function GET() {
	try {
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json({ subscription: null });
		}

		const isPro = await checkSubscription();

		if (!isPro) {
			return NextResponse.json({ subscription: null });
		}

		const _userSubscriptions = await db
			.select()
			.from(userSubscriptions)
			.where(eq(userSubscriptions.userId, userId));

		if (!_userSubscriptions[0]) {
			return NextResponse.json({ subscription: null });
		}

		const userSubscription = _userSubscriptions[0];
		const subscriptionId = userSubscription.razorpaySubscriptionId;

		if (!subscriptionId) {
			return NextResponse.json({ subscription: null });
		}

		// Fetch subscription details from Razorpay API
		const razorpaySubscription = await razorpay.subscriptions.fetch(subscriptionId);

		return NextResponse.json({ subscription: razorpaySubscription });
	} catch (error) {
		console.error("Error checking subscription status:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

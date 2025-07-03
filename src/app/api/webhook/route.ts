import crypto from "node:crypto";
import { getDb } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { getRazorpayClient } from "@/lib/razorpay";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const db = getDb();
	const razorpay = getRazorpayClient();
	const body = await req.text();
	const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string;
	const signature = (await headers()).get("x-razorpay-signature") as string;

	const expectedSignature = crypto
		.createHmac("sha256", webhookSecret)
		.update(body)
		.digest("hex");

	if (signature !== expectedSignature) {
		return new NextResponse("Invalid signature", { status: 400 });
	}

	const event = JSON.parse(body);

	if (event.event === "subscription.activated") {
		// 🎯 Subscription Created
		const subscription = event.payload.subscription.entity;
		const userId = subscription.notes?.userId;

		if (!userId) {
			return new NextResponse("No userId found", { status: 400 });
		}

		// Check if a subscription already exists for this user
		const existingSubscription = await db
			.select()
			.from(userSubscriptions)
			.where(eq(userSubscriptions.userId, userId));

		if (existingSubscription.length > 0) {
			// Update the existing subscription
			await db
				.update(userSubscriptions)
				.set({
					razorpaySubscriptionId: subscription.id,
					razorpayCustomerId: subscription.customer_id,
					razorpayPlanId: subscription.plan_id,
					razorpayCurrentPeriodEnd:
						subscription.current_end != null
							? new Date(subscription.current_end * 1000)
							: null
				})
				.where(eq(userSubscriptions.userId, userId));

			console.log("Subscription updated:", subscription.id);
		} else {
			// Insert a new subscription
			await db.insert(userSubscriptions).values({
				userId,
				razorpaySubscriptionId: subscription.id,
				razorpayCustomerId: subscription.customer_id,
				razorpayPlanId: subscription.plan_id,
				razorpayCurrentPeriodEnd:
					subscription.current_end != null
						? new Date(subscription.current_end * 1000)
						: null
			});

			console.log("Subscription created:", subscription.id);
		}
	}

	if (event.event === "payment.captured") {
		// ✅ Subscription Payment Success (Recurring Invoice Paid)
		const payment = event.payload.payment.entity;

		// Fetch the subscription associated with this payment
		if (payment.subscription_id) {
			const subscription = await razorpay.subscriptions.fetch(
				payment.subscription_id
			);

			await db
				.update(userSubscriptions)
				.set({
					razorpayCurrentPeriodEnd:
						subscription.current_end != null
							? new Date(subscription.current_end * 1000)
							: null
				})
				.where(eq(userSubscriptions.razorpaySubscriptionId, subscription.id));
		}

		console.log("Payment captured:", payment.id);
	}

	return new NextResponse(null, { status: 200 });
}

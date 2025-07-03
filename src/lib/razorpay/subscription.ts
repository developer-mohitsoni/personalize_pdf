import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { userSubscriptions } from "../db/schema";
import { getRazorpayClient } from "../razorpay";

const BASE_URL = process.env.NEXT_BASE_URL as string;

export async function internalHandleSubscription(userId: string) {
	const db = getDb();
	const razorpay = getRazorpayClient();

	const user = await currentUser();
	if (!user) throw new Error("User not found");

	const userEmail = user.emailAddresses[0].emailAddress;
	const userName = user.fullName || "User";

	const existingSubs = await db
		.select()
		.from(userSubscriptions)
		.where(eq(userSubscriptions.userId, userId));

	if (existingSubs[0]?.razorpaySubscriptionId) {
		try {
			const existingSubscription = await razorpay.subscriptions.fetch(
				existingSubs[0].razorpaySubscriptionId
			);
			if (existingSubscription.status === "active") {
				return {
					status: "active",
					message: "You are already subscribed",
					cancelUrl: `${BASE_URL}/`
				};
			}
		} catch (err) {
			console.warn("Failed to fetch existing subscription", err);
		}
	}

	// Check or create customer
	let customerId = existingSubs[0]?.razorpayCustomerId;
	// biome-ignore lint/style/useConst: <explanation>
	let existingSubscriptionId = existingSubs[0]?.razorpaySubscriptionId;

	if (!customerId) {
		const customers = await razorpay.customers.all();
		const matched = customers.items.find((c) => c.email === userEmail);
		if (matched) {
			customerId = matched.id;
		} else {
			const customer = await razorpay.customers.create({
				name: userName,
				email: userEmail
			});
			customerId = customer.id;
		}
	}

	const planId = process.env.PLAN_ID as string;

	// Create subscription
	const subscription = await razorpay.subscriptions.create({
		plan_id: planId,
		customer_notify: 1,
		total_count: 12,
		notes: {
			userId: userId
		}
	});

	// Save to DB
	if (existingSubs[0]) {
		// Check if subscription ID exists, if not update existing record
		if (!existingSubscriptionId) {
			await db
				.update(userSubscriptions)
				.set({
					razorpaySubscriptionId: (subscription as any).id,
					razorpayPlanId: planId,
					razorpayCurrentPeriodEnd: (subscription as any).current_period_end
						? new Date((subscription as any).current_period_end * 1000)
						: null
				})
				.where(eq(userSubscriptions.userId, userId));
		} else {
			await db
				.update(userSubscriptions)
				.set({
					razorpayCustomerId: customerId,
					razorpaySubscriptionId: (subscription as any).id,
					razorpayPlanId: planId,
					razorpayCurrentPeriodEnd: (subscription as any).current_period_end
						? new Date((subscription as any).current_period_end * 1000)
						: null
				})
				.where(eq(userSubscriptions.userId, userId));
		}
	} else {
		await db.insert(userSubscriptions).values({
			userId,
			razorpayCustomerId: customerId,
			razorpaySubscriptionId: (subscription as any).id,
			razorpayPlanId: planId,
			razorpayCurrentPeriodEnd: (subscription as any).current_period_end
				? new Date((subscription as any).current_period_end * 1000)
				: null
		});
	}

	return {
		status: "created",
		subscriptionId: subscription.id,
		customerId,
		name: "ChatPDF Pro",
		email: userEmail,
		key: process.env.RAZORPAY_KEY_ID,
	};
}

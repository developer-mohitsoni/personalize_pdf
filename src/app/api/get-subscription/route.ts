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

		const invoices = await razorpay.invoices.all({
			subscription_id: subscriptionId
		});

		let paymentId: string | undefined =
			invoices.items?.[0]?.payment_id ?? undefined;

		if (!paymentId) {
			// Fallback: find latest successful payment for subscription
			const payments = await razorpay.payments.all({});
			let successfulPayment: any;
			if (payments && typeof payments === "object" && "items" in payments) {
				successfulPayment = payments.items.find(
					(p: any) => p.status === "captured"
				);
				paymentId = successfulPayment?.id;
			}

			if (!paymentId) {
				const payments = await razorpay.payments.all({});
				let successfulPayment: any;

				if (payments && typeof payments === "object" && "items" in payments) {
					successfulPayment = payments.items.find((p: any) => {
						return (
							p.subscription_id === subscriptionId && p.status === "captured"
						);
					});
					paymentId = successfulPayment?.id;
				}
			}
		}

		let cardDetails = { last4: "N/A", expiry: "N/A" };

		if (invoices.items?.length) {
			const paymentId = invoices.items[0].payment_id;
			let payment: any;
			if (paymentId) {
				payment = await razorpay.payments.fetch(paymentId);
				if (payment?.card) {
					cardDetails = {
						last4: payment.card.last4,
						expiry: `${payment.card.expiry_month}/${payment.card.expiry_year}`
					};
				}
			}
		}

		let razorpaySubscription: any;
		try {
			// Fetch subscription details from Razorpay API
			razorpaySubscription = await razorpay.subscriptions.fetch(subscriptionId);
		} catch (error: any) {
			console.error("Error fetching subscription details:", error);
			return NextResponse.json({ subscription: null });
		}

		if (!razorpaySubscription) {
			return NextResponse.json({ subscription: null });
		}

		let customer: any;
		try {
			if (razorpaySubscription.customer_id) {
				// Fetch customer details from Razorpay API
				customer = await razorpay.customers.fetch(
					razorpaySubscription.customer_id
				);
			} else {
				customer = { name: "N/A", email: "N/A" };
			}

			let plan;
			try {
				// Fetch plan details from Razorpay API
				if (razorpaySubscription.plan_id) {
					plan = await razorpay.plans.fetch(razorpaySubscription.plan_id);

					return NextResponse.json({
						subscription: {
							...razorpaySubscription,
							customer_details: customer,
							plan_name: plan?.item?.name,
							amount: Number(plan?.item?.amount) / 100,
							currency: plan?.item?.currency,
							cardDetails
						}
					});
				}
				return NextResponse.json({ subscription: null });
			} catch (error: any) {
				console.error("Error fetching plan details:", error);
				return NextResponse.json({ subscription: null });
			}
		} catch (error: any) {
			console.error("Error checking subscription status:", error);
			return new NextResponse(error.message, { status: 500 });
		}
	} catch (error: any) {
		console.error("Error checking subscription status:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { userSubscriptions } from "./db/schema";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const checkSubscription = async () => {
	const db = getDb();

	const { userId } = await auth();
	if (!userId) {
		return false;
	}

	const _userSubscriptions = await db
		.select()
		.from(userSubscriptions)
		.where(eq(userSubscriptions.userId, userId));

	if (!_userSubscriptions[0]) {
		return false;
	}

	const userSubscription = _userSubscriptions[0];

	const isValid =
		userSubscription.razorpayPlanId &&
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		userSubscription.razorpayCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
			Date.now();

	return !!isValid;
};

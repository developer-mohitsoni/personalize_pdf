// src/lib/razorpay.ts
import Razorpay from "razorpay";

let razorpay: Razorpay | null = null;

export function getRazorpayClient() {
	if (!razorpay) {
		const key_id = process.env.RAZORPAY_KEY_ID;
		const key_secret = process.env.RAZORPAY_KEY_SECRET;

		if (!key_id || !key_secret) {
			throw new Error(
				"RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined"
			);
		}

		razorpay = new Razorpay({ key_id, key_secret });
	}
	return razorpay;
}

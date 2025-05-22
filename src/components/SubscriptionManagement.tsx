"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Subscription {
	status: string;
	plan_id: string;
	current_start?: number;
	current_end?: number;
	customer_details?: {
		name: string;
		email: string;
	};
	plan_name: string;
	amount: number;
	currency: string;
	cardDetails?: {
		last4: string;
		expiry: string;
	};
}

const SubscriptionManagement = () => {
	const [subscription, setSubscription] = useState<Subscription | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSubscription = async () => {
			try {
				const response = await axios.get("/api/get-subscription");
				setSubscription(response.data.subscription as Subscription);
			} catch (error) {
				console.error("Error fetching subscription:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSubscription();
	}, []);

	const handleCancelSubscription = async () => {
		try {
			setLoading(true);
			await axios.post("/api/cancel-subscription");
			// Refresh subscription status after cancellation
			const response = await axios.get("/api/get-subscription");
			setSubscription(response.data.subscription);
		} catch (error) {
			console.error("Error cancelling subscription:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <p>Loading subscription details...</p>;
	}

	if (!subscription) {
		return <p>No subscription found.</p>;
	}

	return (
		<div className="mx-auto min-h-screen bg-gray-100 py-8 font-sans">
			<div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md">
				<Link href="/" className="mb-4 block text-blue-500 hover:text-blue-700">
					← Return to chatpdf-yt
				</Link>
				<h1 className="mb-4 font-semibold text-3xl">Current Plan</h1>
				{subscription ? (
					<div>
						<h2 className="mb-4 font-semibold text-xl">
							{subscription.plan_name}
						</h2>
						<p className="mb-2 text-gray-700">
							{subscription.currency} {subscription.amount} per month
						</p>
						<p className="mb-2 text-gray-700">
							Your plan renews on{" "}
							{subscription.current_end
								? new Date(subscription.current_end * 1000).toLocaleDateString()
								: "N/A"}
						</p>
						{subscription.cardDetails?.last4 || "N/A"}
						<h3 className="mt-6 mb-4 font-semibold text-xl">Payment Method</h3>
						<p className="mb-2 text-gray-700">
							Visa •••• {subscription.cardDetails?.last4 || "N/A"} Expires{" "}
						</p>
						{subscription.cardDetails?.expiry || "N/A"}
						<button type="button" className="text-blue-500 hover:text-blue-700">
							+ Add payment method
						</button>
						<h3 className="mt-6 mb-4 font-semibold text-xl">
							Billing Information
						</h3>
						<p className="mb-2 text-gray-700">
							Name: {subscription?.customer_details?.name || "N/A"}
						</p>
						<p className="mb-2 text-gray-700">
							Email: {subscription?.customer_details?.email || "N/A"}
						</p>
						<p className="mb-2 text-gray-700">Billing address: N/A</p>
						<button type="button" className="text-blue-500 hover:text-blue-700">
							+ Update information
						</button>
						<button
							disabled={loading}
							onClick={handleCancelSubscription}
							type="button"
							className="mt-6 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-200 disabled:opacity-50"
						>
							{loading ? "Cancelling..." : "Cancel Plan"}
						</button>
					</div>
				) : (
					<p className="text-gray-700">No subscription found.</p>
				)}
			</div>
		</div>
	);
};

export default SubscriptionManagement;

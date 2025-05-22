"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Subscription {
	status: string;
	plan_id: string;
	current_start?: number;
	current_end?: number;
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
		<div className="container mx-auto py-8">
			<h2 className="mb-4 font-bold text-2xl">Subscription Details</h2>
			{subscription ? (
				<div className="rounded-lg bg-white p-4 shadow-md">
					<p className="text-gray-700">
						<span className="font-semibold">Status:</span> {subscription.status}
					</p>
					<p className="text-gray-700">
						<span className="font-semibold">Plan:</span> {subscription.plan_id}
					</p>
					<p className="text-gray-700">
						<span className="font-semibold">Current Period End:</span>{" "}
						{subscription.current_end
							? new Date(
									subscription.current_end * 1000
								).toLocaleDateString()
							: "N/A"}
					</p>
					<button
						disabled={loading}
						onClick={handleCancelSubscription}
						type="button"
						className="mt-4 rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
					>
						{loading ? "Cancel Subscription" : "Cancelling..."}
					</button>
				</div>
			) : (
				<p className="text-gray-700">No subscription found.</p>
			)}
		</div>
	);
};

export default SubscriptionManagement;

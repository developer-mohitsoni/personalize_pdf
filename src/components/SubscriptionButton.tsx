"use client";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

declare global {
	interface Window {
		Razorpay: any;
	}
}

const SubscriptionButton = () => {
	const [loading, setLoading] = useState(false);
	const [isPro, setIsPro] = useState(false);
	const router = useRouter();

	const checkProStatus = useCallback(async () => {
		try {
			const response = await axios.get("/api/check-subscription");
			setIsPro(response.data.isPro);
		} catch (error) {
			console.error("Error checking subscription status:", error);
		}
	}, []);

	useEffect(() => {
		checkProStatus();
	}, [checkProStatus]);

	const handleSubscription = async () => {
		if (isPro) {
			router.push("/subscription-management");
		} else {
			try {
				setLoading(true);
				const response = await axios.post("/api/razorpay");

				const { key, subscriptionId } = response.data;

				const script = document.createElement("script");
				script.src = "https://checkout.razorpay.com/v1/checkout.js";
				script.async = true;
				script.onload = () => {
					const options = {
						key: key, // Enter the Key ID generated from the Razorpay Dashboard
						amount: "200000", // Amount is in currency subunits. Default currency is INR. Hence, 200000 refers to 2000 INR
						currency: "INR",
						name: "ChatPDF Pro",
						description: "Test Transaction",
						image: "https://example.com/your_logo.svg",
						subscription_id: subscriptionId,
						handler: (response: any) => {
							alert(response.razorpay_payment_id);
							alert(response.razorpay_signature);
							checkProStatus();
						},
						prefill: {
							name: "Gaurav Kumar",
							email: "gaurav.kumar@example.com",
							contact: "7819954645"
						},
						notes: {
							address: "Razorpay Corporate Office"
						},
						theme: {
							color: "#3399cc"
						}
					};
					const razor = new window.Razorpay(options);
					razor.open();
				};
				script.onerror = () => {
					console.error("Razorpay checkout script failed to load");
				};

				document.body.appendChild(script);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<Button disabled={loading} onClick={handleSubscription} variant="outline">
			{isPro ? "Manage Subscriptions" : "Get Pro"}
		</Button>
	);
};

export default SubscriptionButton;

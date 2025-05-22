"use client";

import type { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import axios from "axios";
import { MessageCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

type Props = {
	chats: DrizzleChat[];
	chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
	const [loading, setLoading] = useState(false);
	// ✅ Razorpay script loader
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		document.body.appendChild(script);
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handleSubscription = async () => {
		const response = await axios.post("/api/razorpay");
		const data = response.data;

		console.log("Data from /api/razorpay:", data);

		try {
			setLoading(true);

			if (data.status === "active") {
				window.location.href = data.cancelUrl;
				return;
			}

			if (data.subscriptionId) {
				console.log("data.subscriptionId exists:", data.subscriptionId);
				// Ensure Razorpay script is loaded
				if (typeof (window as any).Razorpay === 'undefined') {
					console.error('Razorpay script not loaded');
					toast.error('Razorpay script not loaded. Please try again.');
					return;
				}

				console.log("Razorpay script loaded");

				const razorpay = new (window as any).Razorpay({
					key: data.key,
					subscription_id: data.subscriptionId,
					name: data.name,
					prefill: {
						name: data.name,
						email: data.email
					},
					handler: (response: any) => {
						// optional: validate payment here or via webhook
					},
					theme: { color: "#6366f1" }
				});
				console.log("Razorpay instance created");
				razorpay.open();
				console.log("Razorpay screen opened");
			} else {
				console.log("data.subscriptionId does not exist");
			}
		} catch (err) {
			console.error("Razorpay error", err);
			toast.error(`Failed to initialize Razorpay: ${(err as Error).message}. Please try again.`);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex h-full flex-col p-4">
			{/* New Chat Button */}
			<Link href={"/"}>
				<Button
					variant="outline"
					className="flex w-full items-center justify-center gap-2 border-white border-dashed bg-gray-900 text-white hover:bg-white/10"
				>
					<PlusCircle className="h-5 w-5" />
					New Chat
				</Button>
			</Link>

			{/* Chat List */}
			<div className="mt-6 flex-1 space-y-2 overflow-y-auto">
				{chats.length === 0 && (
					<p className="text-center text-gray-400 text-sm">No chats yet</p>
				)}

				{chats.map((chat) => (
					<Link key={chat.id} href={`/chat/${chat.id}`}>
						<div
							className={cn(
								"flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition",
								{
									"bg-blue-600 text-white": chat.id === chatId,
									"text-gray-300 hover:bg-white/10": chat.id !== chatId
								}
							)}
						>
							<MessageCircle className="h-5 w-5 shrink-0" />
							<span className="truncate text-sm">
								{chat.pdfName || "Untitled PDF"}
							</span>
						</div>
					</Link>
				))}
			</div>

			{/* Footer */}
			<footer className="flex flex-col gap-1 border-white/20 border-t pt-4 text-gray-400 text-sm">
				<Link href="/" className="hover:underline">
					Home
				</Link>
				<Link href="/" className="hover:underline">
					Source
				</Link>
				{/* Optional: Add credits or logout button */}
				<Button
					className="mt-2 bg-slate-700 text-white"
					disabled={loading}
					onClick={handleSubscription}
				>
					Upload To Pro!
				</Button>
			</footer>
		</div>
	);
};

export default ChatSideBar;

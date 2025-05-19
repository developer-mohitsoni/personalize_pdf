"use client";

import type { DrizzleChat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { MessageCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

type Props = {
	chats: DrizzleChat[];
	chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
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
			</footer>
		</div>
	);
};

export default ChatSideBar;

"use client";

import type { Message } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import type { RefObject } from "react";

type Props = {
	messages: Message[];
	scrollRef: RefObject<HTMLDivElement | null>;
	isLoading: boolean;
};

const MessageList = ({ messages, scrollRef, isLoading }: Props) => {
	if (isLoading) {
		return (
			<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
				<Loader2 className="h-6 w-6 animate-spin" />
			</div>
		);
	}
	if (!messages) return null;

	return (
		<div className="flex flex-col gap-4 p-4">
			{messages.map((msg, idx) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={idx}
					className={`max-w-[75%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm shadow ${msg.role === "user" ? "self-end bg-blue-600 text-white" : "self-start bg-gray-100 text-gray-800"}`}
					style={{
						maxHeight: "300px", // 🔥 control height
						overflowY: "auto" // 🔥 allow scroll inside
					}}
				>
					{msg.content}
				</div>
			))}
			<div ref={scrollRef} />
		</div>
	);
};

export default MessageList;

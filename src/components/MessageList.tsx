"use client";

import type { Message } from "@ai-sdk/react";
import type { RefObject } from "react";

type Props = {
	messages: Message[];
	scrollRef: RefObject<HTMLDivElement | null>;
};

const MessageList = ({ messages, scrollRef }: Props) => {
	if (!messages) return null;

	return (
		<div className="flex flex-col gap-4 p-4">
			{messages.map((msg, idx) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={idx}
					className={`max-w-[75%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm shadow${msg.role === "user" ? "self-end bg-blue-600 text-white" : "self-start bg-gray-100 text-gray-800"}`}
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

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
		<div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
			{messages.map((m, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={i}
					className={`flex ${
						m.role === "user" ? "justify-end" : "justify-start"
					}`}
				>
					<div
						className={`break-words rounded-xl px-4 py-2 text-sm shadow-md ${
							m.role === "user"
								? "bg-blue-600 text-white"
								: "bg-gray-200 text-gray-900"
						}`}
						style={{
							maxWidth: "75%",
							width: "fit-content"
						}}
					>
						{m.content}
					</div>
				</div>
			))}
			<div ref={scrollRef} />
		</div>
	);
};

export default MessageList;

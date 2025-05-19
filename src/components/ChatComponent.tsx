"use client";

import { useChat } from "@ai-sdk/react";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ChatComponent = () => {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: "/api/chat"
	});

	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when messages update
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<div className="flex h-full flex-col border-l bg-white">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
				<h3 className="font-semibold text-gray-800 text-xl">AI Assistant</h3>
			</header>

			{/* Message List */}
			<MessageList messages={messages} scrollRef={messagesEndRef} />

			{/* Input */}
			<form
				onSubmit={handleSubmit}
				className="sticky bottom-0 z-10 flex items-center gap-2 border-t bg-white px-4 py-3"
			>
				<Input
					value={input}
					onChange={handleInputChange}
					placeholder="Ask anything about your PDF..."
					className="flex-1"
				/>
				<Button
					type="submit"
					size="icon"
					className="bg-blue-600 hover:bg-blue-700"
				>
					<Send className="h-5 w-5" />
				</Button>
			</form>
		</div>
	);
};

export default ChatComponent;

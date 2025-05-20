"use client";

import { useChat } from "@ai-sdk/react";
import { useQuery } from "@tanstack/react-query";
import type { Message } from "ai";
import axios from "axios";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
	chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
	const { data, isLoading } = useQuery({
		queryKey: ["chat", chatId],
		queryFn: async () => {
			const reponse = await axios.post<Message[]>("/api/get-messages", {
				chatId
			});

			return reponse.data;
		}
	});
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: "/api/chat",
		body: {
			chatId
		},
		initialMessages: data || []
	});

	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom when messages update
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const messageContainer = document.getElementById("message-container");
		if (messageContainer) {
			messageContainer.scrollTo({
				top: messageContainer.scrollHeight,
				behavior: "smooth"
			});
		}
	}, [messages]);

	return (
		<div
			className="flex h-full flex-col border-l bg-white"
			id="message-container"
		>
			{/* Header */}
			<header className="sticky top-0 z-10 bg-white p-4 shadow-sm">
				<h3 className="font-semibold text-gray-800 text-xl">AI Assistant</h3>
			</header>

			{/* Message List */}
			<div className="flex-1 overflow-y-auto">
				<MessageList
					messages={messages}
					scrollRef={messagesEndRef}
					isLoading={isLoading}
				/>
			</div>

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

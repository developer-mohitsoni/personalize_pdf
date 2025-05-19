import ChatSideBar from "@/components/ChatSideBar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
	params: {
		chatId: string;
	};
};

const ChatPdf = async ({ params: { chatId } }: Props) => {
	const { userId } = await auth();

	if (!userId) return redirect("/sign-in");

	const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
	if (!_chats || !_chats.find((chat) => chat.id === Number(chatId)))
		return redirect("/");

	return (
		<div className="flex h-screen overflow-hidden">
			{/* Sidebar */}
			<aside className="w-64 bg-gray-900 text-white">
				<ChatSideBar chats={_chats} chatId={Number(chatId)} />
			</aside>

			{/* PDF Viewer */}
			<main className="flex-1 overflow-y-auto bg-white p-6">
				<div className="flex h-full items-center justify-center rounded-xl border bg-gray-50 text-gray-400 text-xl shadow-inner">
					{/* Replace with actual PDF Viewer */}
					PDF Viewer Placeholder
				</div>
			</main>

			{/* Chat Component */}
			<aside className="w-[28rem] border-l bg-white">
				<div className="p-4 text-gray-700">
					{/* Replace with actual Chat UI */}
					Chat Component Placeholder
				</div>
			</aside>
		</div>
	);
};

export default ChatPdf;

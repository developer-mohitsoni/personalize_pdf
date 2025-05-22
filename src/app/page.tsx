import FileUpload from "@/components/FileUpload";
import SubscriptionButton from "@/components/SubscriptionButton";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
	const { userId } = await auth();
	const isAuth = !!userId;

	const isPro = await checkSubscription();

	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let firstChat;

	if (userId) {
		firstChat = await db.select().from(chats).where(eq(chats.userId, userId));

		if (firstChat) {
			firstChat = firstChat[0];
		}
	}

	return (
		<main className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-tr from-rose-100 via-white to-teal-100 px-4">
			<section className="w-full max-w-2xl space-y-6 text-center">
				<header className="flex items-center justify-center gap-3">
					<h1 className="font-bold text-5xl text-gray-800 tracking-tight">
						Chat with any PDF
					</h1>
					<UserButton afterSignOutUrl="/" />
				</header>

				<p className="text-lg text-muted-foreground">
					Join millions of students, researchers, and professionals using AI to
					instantly answer questions and understand research with ease.
				</p>

				{isAuth && firstChat ? (
					<div className="space-y-4">
						<Button asChild className="px-6 py-4 text-base">
							<Link href={`/chat/${firstChat.id}`}>
								Go to Chats <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>

						<div className="ml-3">
							<SubscriptionButton />
						</div>

						<FileUpload />
					</div>
				) : (
					<Button
						asChild
						size="lg"
						className="mt-4 px-6 py-4 text-base shadow-lg transition hover:shadow-xl"
					>
						<Link href="/sign-in">
							Login to Get Started <LogIn className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				)}
			</section>
		</main>
	);
}

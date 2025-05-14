import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
	const { userId } = await auth();
	const isAuth = !!userId;

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

				{isAuth ? (
					<div className="space-y-4">
						<Button asChild className="px-6 py-4 text-base">
							<Link href="/chat">
								Go to Chats <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>

						<div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur-md">
							<h2 className="font-semibold text-gray-700 text-xl">
								Upload your PDF to get started
							</h2>
							{/* Replace below with your actual uploader */}
							<div className="mt-2 text-gray-500 text-sm italic">
								[PDF Upload Component]
							</div>
						</div>
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

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function Home() {
	const { userId } = await auth();

	const isAuth = !!userId;
	return (
		<>
			<div className="to min-h-screen w-screen bg-gradient-to-r from-rose-100 to-teal-100">
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
					<div className="flex flex-col items-center text-center">
						<div className="flex items-center">
							<h1 className="mr-3 font-semibold text-5xl">Chat with any PDF</h1>
							<UserButton />
						</div>
						<div className="mt-2 flex">
							{isAuth && <Button>Go to Chats</Button>}
						</div>

						<p className="mt-1 max-w-xl text-lg text-slate-600">
							Join millions of students, researchers and professionals to
							instantly answer questions and understand research with AI.
						</p>

						<div className="mt-4 w-full">
							{isAuth ? (
								<h1>fileupload</h1>
							) : (
								<Link href={"/sign-in"}>
									<Button>
										Login to get Started!
										<LogIn className="ml-2 h-4 w-4" />
									</Button>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
			<SignIn />
		</div>
	);
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/container";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/auth";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data, isPending } = useAuth();
	const pathname = usePathname();

	if (isPending) return <Loader />;

	if (!data)
		return (
			<Container>
				<Card>
					<CardHeader>
						<CardTitle>Not Authenticated</CardTitle>
						<CardDescription>Please login to access this page.</CardDescription>
					</CardHeader>
					<CardFooter className="gap-2">
						<Button className="flex-1" variant={"secondary"} asChild>
							<Link href={"/"}>Go to Home</Link>
						</Button>
						<Button className="flex-1" asChild>
							<Link href={`/login?redirect_to=${encodeURIComponent(pathname)}`}>
								Go to Login
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</Container>
		);

	return children;
}

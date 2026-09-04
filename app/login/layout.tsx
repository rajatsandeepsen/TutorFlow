"use client";

import { redirect } from "next/navigation";
import { CenterContainer } from "@/components/container";
import { useAuth } from "@/hooks/auth";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data } = useAuth();

	if (data) {
		return redirect(`/${data.role}`);
	}

	return <CenterContainer>{children}</CenterContainer>;
}

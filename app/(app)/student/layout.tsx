"use client";

import { redirect } from "next/navigation";
import { SelfCenterContainer } from "@/components/container";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/student-sidebar";
import { useAuth } from "@/hooks/auth";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data } = useAuth();

	if (!data) return null;
	if (data.role !== "student") {
		return redirect(`/login`);
	}

	return (
		<SidebarProvider>
			<StudentSidebar />
			<SidebarInset>
				<header className="flex h-12 items-center border-b px-4">
					<SidebarTrigger />
				</header>
				<SelfCenterContainer>{children}</SelfCenterContainer>
			</SidebarInset>
		</SidebarProvider>
	);
}

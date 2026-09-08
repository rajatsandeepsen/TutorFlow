"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SelfCenterContainer } from "@/components/container";
import { TeacherSidebar } from "@/components/teacher-sidebar";
import { useAuth } from "@/hooks/auth";
import { redirect } from "next/navigation";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data } = useAuth();

	if (!data) return null;
	if (data.role !== "teacher") {
		return redirect(`/login`);
	}

	return (
		<SidebarProvider>
			<TeacherSidebar />
			<SidebarInset>
				<header className="flex h-12 items-center border-b px-4">
					<SidebarTrigger />
				</header>
				<SelfCenterContainer>{children}</SelfCenterContainer>
			</SidebarInset>
		</SidebarProvider>
	);
}

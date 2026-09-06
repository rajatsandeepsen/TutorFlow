"use client";

import {
	BookOpen,
	Calendar,
	Clock3,
	FileText,
	UserPlus,
	Users,
} from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth";
import { SelfCenterContainer } from "@/components/container";
import { CardTitle } from "@/components/ui/card";

const teacherSidebarItems = [
	{ title: "Calender", href: "/teacher/calender", icon: Calendar },
	{ title: "Homework", href: "/teacher/homework", icon: BookOpen },
	{ title: "Invite", href: "/teacher/invite", icon: UserPlus },
	{ title: "Notes", href: "/teacher/notes", icon: FileText },
	{ title: "Slot", href: "/teacher/slot", icon: Clock3 },
	{ title: "Students", href: "/teacher/students", icon: Users },
];

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data } = useAuth();
	const pathname = usePathname();

	if (data?.role !== "teacher") {
		return redirect(`/login`);
	}

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="border-b px-2 py-3">
					<CardTitle>Teacher</CardTitle>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						{teacherSidebarItems.map((item) => (
							<SidebarMenuItem key={item.href}>
								<SidebarMenuButton
									asChild
									isActive={
										pathname === item.href ||
										pathname.startsWith(`${item.href}/`)
									}
								>
									<Link href={item.href}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarContent>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-12 items-center border-b px-4">
					<SidebarTrigger />
				</header>
				<SelfCenterContainer>{children}</SelfCenterContainer>
			</SidebarInset>
		</SidebarProvider>
	);
}

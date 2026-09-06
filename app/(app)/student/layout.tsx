"use client";

import { BookOpen, Calendar, Clock3, FileText, User } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { SelfCenterContainer } from "@/components/container";
import { CardTitle } from "@/components/ui/card";
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

const studentSidebarItems = [
	{ title: "Calender", href: "/student/calender", icon: Calendar },
	{ title: "Homework", href: "/student/homework", icon: BookOpen },
	{ title: "Notes", href: "/student/notes", icon: FileText },
	{ title: "Profile", href: "/student/profile", icon: User },
	{ title: "Sessions", href: "/student/sessions", icon: Clock3 },
];

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data } = useAuth();
	const pathname = usePathname();

	if (data?.role !== "student") {
		return redirect(`/login`);
	}

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="border-b px-2 py-3">
					<CardTitle>Student</CardTitle>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						{studentSidebarItems.map((item) => (
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

"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, Clock3, FileText, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { CardTitle } from "@/components/ui/card";
import { client } from "@/hooks/api";

const studentSidebarItems = [
	{ title: "Calendar", href: "/student/calender", icon: Calendar },
	{ title: "Homework", href: "/student/homework", icon: BookOpen },
	{ title: "Notes", href: "/student/notes", icon: FileText },
	{ title: "Profile", href: "/student/profile", icon: User },
	{ title: "Sessions", href: "/student/sessions", icon: Clock3 },
] as const;

export function StudentSidebar() {
	const pathname = usePathname();
	const sidebarQuery = useQuery({
		queryKey: ["student", "sidebar-summary"],
		queryFn: () => client.student.getSidebarSummary(),
	});

	const sidebarData = sidebarQuery.data;

	return (
		<Sidebar>
			<SidebarHeader className="border-b px-2 py-3">
				<CardTitle>Student</CardTitle>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspace</SidebarGroupLabel>
					<SidebarGroupContent>
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
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Recent sessions</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenuSub>
							{(sidebarData?.recentSessions ?? []).map((item) => (
								<SidebarMenuSubItem key={item.id}>
									<SidebarMenuSubButton
										asChild
										isActive={pathname === `/student/sessions/${item.id}`}
									>
										<Link href={`/student/sessions/${item.id}`}>
											<span className="flex min-w-0 flex-1 flex-col items-start">
												<span className="truncate">{item.topic}</span>
												<span className="truncate text-xs opacity-70">
													{item.teacherName} • {item.status}
												</span>
											</span>
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
							{(sidebarData?.recentSessions ?? []).length === 0 && (
								<li className="px-2 py-1 text-muted-foreground text-xs">
									No recent sessions.
								</li>
							)}
						</SidebarMenuSub>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Homework</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenuSub>
							{(sidebarData?.recentHomeworks ?? []).map((item) => (
								<SidebarMenuSubItem key={item.id}>
									<SidebarMenuSubButton
										asChild
										isActive={pathname === `/student/sessions/${item.slotId}/homework/${item.id}`}
									>
										<Link href={`/student/sessions/${item.slotId}/homework/${item.id}`}>
											<span className="flex min-w-0 flex-1 flex-col items-start">
												<span className="truncate">{item.question}</span>
												<span className="truncate text-xs opacity-70">
													{item.topic} • {item.score ?? "Not scored"}
												</span>
											</span>
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
							{(sidebarData?.recentHomeworks ?? []).length === 0 && (
								<li className="px-2 py-1 text-muted-foreground text-xs">
									No recent homework.
								</li>
							)}
						</SidebarMenuSub>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Notes</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenuSub>
							{(sidebarData?.recentNotes ?? []).map((item) => (
								<SidebarMenuSubItem key={item.id}>
									<SidebarMenuSubButton
										asChild
										isActive={pathname === `/student/sessions/${item.slotId}/notes/${item.id}`}
									>
										<Link href={`/student/sessions/${item.slotId}/notes/${item.id}`}>
											<span className="flex min-w-0 flex-1 flex-col items-start">
												<span className="truncate">{item.topic}</span>
												<span className="truncate text-xs opacity-70">
													{item.id}
												</span>
											</span>
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
							{(sidebarData?.recentNotes ?? []).length === 0 && (
								<li className="px-2 py-1 text-muted-foreground text-xs">
									No recent notes.
								</li>
							)}
						</SidebarMenuSub>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

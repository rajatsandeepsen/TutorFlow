"use client";

import { useQuery } from "@tanstack/react-query";
import {
	Calendar,
	Clock3,
	FileText,
	MessageSquareText,
	NotebookPen,
	Users,
} from "lucide-react";
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

const teacherSidebarItems = [
	{ title: "Session Hub", href: "/teacher/session", icon: MessageSquareText },
	{ title: "Calendar", href: "/teacher/calender", icon: Calendar },
	{ title: "Slot Booking", href: "/teacher/slot", icon: Clock3 },
	{ title: "Invite", href: "/teacher/invite", icon: NotebookPen },
	{ title: "Students", href: "/teacher/students", icon: Users },
	{ title: "Notes", href: "/teacher/notes", icon: FileText },
] as const;

export function TeacherSidebar() {
	const pathname = usePathname();
	const sidebarQuery = useQuery({
		queryKey: ["teacher", "sidebar-summary"],
		queryFn: () => client.teacher.getSidebarSummary(),
	});

	const sidebarData = sidebarQuery.data;

	return (
		<Sidebar>
			<SidebarHeader className="border-b px-2 py-3">
				<CardTitle>Teacher</CardTitle>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspace</SidebarGroupLabel>
					<SidebarGroupContent>
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
										isActive={pathname === `/teacher/session/${item.id}`}
									>
										<Link href={`/teacher/session/${item.id}`}>
											<span className="flex min-w-0 flex-1 flex-col items-start">
												<span className="truncate">{item.topic}</span>
												<span className="truncate text-xs opacity-70">
													{item.studentName} • {item.status}
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
										isActive={pathname === `/teacher/homework/${item.id}`}
									>
										<Link href={`/teacher/homework/${item.id}`}>
											<span className="flex min-w-0 flex-1 flex-col items-start">
												<span className="truncate">{item.question}</span>
												<span className="truncate text-xs opacity-70">
													{item.studentName} • {item.topic}
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
										isActive={pathname === `/teacher/session/${item.slotId}/notes`}
									>
										<Link href={`/teacher/session/${item.slotId}/notes`}>
											<span className="flex min-w-0 flex-1 flex-col items-start">
												<span className="truncate">{item.topic}</span>
												<span className="truncate text-xs opacity-70">
													{item.studentName} • {item.id}
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

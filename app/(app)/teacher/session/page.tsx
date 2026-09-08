"use client";

import Link from "next/link";

const quickLinks = [
	{
		title: "Calendar",
		href: "/teacher/calender",
		description: "See all sessions and update status.",
	},
	{
		title: "Slot Booking",
		href: "/teacher/slot",
		description: "Schedule a new 1:1 session.",
	},
	{
		title: "Notes",
		href: "/teacher/notes",
		description: "Add notes or homework for a session.",
	},
	{
		title: "Invite",
		href: "/teacher/invite",
		description: "Create a new student account.",
	},
	{
		title: "Students",
		href: "/teacher/students",
		description: "Search and manage students.",
	},
] as const;

export default function Page() {
	return (
		<div className="grid gap-4 p-4">
			<div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
				<div className="space-y-1 border-b pb-4">
					<h1 className="font-semibold text-2xl tracking-tight">Session Hub</h1>
					<p className="text-muted-foreground text-sm">
						Quick access to the teacher tools you use around a session.
					</p>
				</div>

				<div className="grid gap-3 pt-4 md:grid-cols-2">
					{quickLinks.map((item) => (
						<div key={item.href} className="rounded-md border p-4">
							<p className="font-medium">{item.title}</p>
							<p className="mt-1 text-muted-foreground text-sm">{item.description}</p>
							<Link
								href={item.href}
								className="mt-3 inline-flex rounded-md border px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
							>
								Open
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { client } from "@/hooks/api";

export default function Page() {
	const params = useParams<{ slotId: string }>();
	const slotId = params.slotId;

	const slotsQuery = useQuery({
		queryKey: ["teacher", "slots", slotId],
		queryFn: async () => await client.teacher.getSlotsList({ limit: 200 }),
	});

	const slot = useMemo(() => {
		return slotsQuery.data?.find((item) => item.id === slotId);
	}, [slotsQuery.data, slotId]);

	const sessionLinks = [
		{ label: "Open notes", href: `/teacher/notes/${slotId}`, variant: "default" as const },
		{ label: "Open calendar", href: "/teacher/calender", variant: "outline" as const },
		{ label: "Back to slot booking", href: "/teacher/slot", variant: "outline" as const },
		{
			label: "Open student profile",
			href: slot?.studentId ? `/teacher/students/${slot.studentId}` : "/teacher/students",
			variant: "secondary" as const,
		},
		{
			label: "Schedule another session",
			href: slot?.studentId ? `/teacher/slot/${slot.studentId}` : "/teacher/slot",
			variant: "secondary" as const,
		},
	];

	return (
		<div className="grid gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>Session Hub</CardTitle>
					<CardDescription>
						Quick links for this session and the related teacher pages.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 text-sm">
					<p>
						<span className="font-medium">Slot ID:</span> {slotId}
					</p>
					<p>
						<span className="font-medium">Student:</span>{" "}
						{slot?.studentName ?? "-"}
					</p>
					<p>
						<span className="font-medium">Topic:</span> {slot?.topic ?? "-"}
					</p>
					<p>
						<span className="font-medium">Status:</span> {slot?.status ?? "-"}
					</p>
					<p>
						<span className="font-medium">Start:</span>{" "}
						{slot ? new Date(slot.startTime).toLocaleString() : "-"}
					</p>
					<p>
						<span className="font-medium">End:</span>{" "}
						{slot ? new Date(slot.endTime).toLocaleString() : "-"}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Session Actions</CardTitle>
					<CardDescription>
						Jump to the related pages for this same session.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-wrap gap-2">
					{sessionLinks.map((item) => (
						<Button key={item.href} asChild variant={item.variant}>
							<Link href={item.href}>{item.label}</Link>
						</Button>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

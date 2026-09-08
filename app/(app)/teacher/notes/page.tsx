"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
	const sidebarQuery = useQuery({
		queryKey: ["teacher", "sidebar-summary"],
		queryFn: () => client.teacher.getSidebarSummary(),
	});

	return (
		<div className="grid gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>Notes Hub</CardTitle>
					<CardDescription>
						Open a recent session note or jump to a session editor.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3">
					{(sidebarQuery.data?.recentNotes ?? []).map((item) => (
						<Card key={item.id}>
							<CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
								<div className="min-w-0">
									<p className="truncate font-medium">{item.topic}</p>
									<p className="truncate text-muted-foreground text-xs">
										{item.studentName} • {item.id}
									</p>
								</div>
								<Button asChild variant="outline" size="sm">
									<Link href={`/teacher/session/${item.slotId}/notes`}>
										Open session notes
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
					{(sidebarQuery.data?.recentNotes ?? []).length === 0 && (
						<p className="text-muted-foreground text-sm">No recent notes yet.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

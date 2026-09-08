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
	const notesQuery = useQuery({
		queryKey: ["student", "notes"],
		queryFn: () => client.student.getAllMyNotes({ limit: 100 }),
	});

	return (
		<div className="p-4">
			<Card>
				<CardHeader>
					<CardTitle>Session Notes</CardTitle>
					<CardDescription>
						All notes shared by your teacher after sessions.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3">
					{notesQuery.data?.map((note) => (
						<Card key={note.id}>
							<CardContent className="flex flex-col gap-2 p-4 md:flex-row md:items-center">
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">{note.topic}</p>
									<p className="text-muted-foreground text-xs">
										{new Date(note.startTime).toLocaleString()} -{" "}
										{new Date(note.endTime).toLocaleTimeString()}
									</p>
									<p className="line-clamp-2 text-sm">{note.text}</p>
								</div>
								<Button asChild variant="outline" size="sm">
									<Link href={`/student/sessions/${note.slotId}/notes/${note.id}`}>
										Open
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
					{notesQuery.data && notesQuery.data.length === 0 && (
						<p className="text-muted-foreground text-sm">No notes yet.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/hooks/api";

export default function Page() {
	const params = useParams<{ noteId: string }>();
	const noteId = params.noteId;

	const noteQuery = useQuery({
		queryKey: ["student", "note", noteId],
		queryFn: () => client.student.getMyNoteById({ noteId }),
	});

	return (
		<div className="p-4">
			<Card>
				<CardHeader>
					<CardTitle>Session Note</CardTitle>
					<CardDescription>
						{noteQuery.data?.topic ?? "Loading..."}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-muted-foreground text-sm">
						{noteQuery.data
							? new Date(noteQuery.data.startTime).toLocaleString()
							: ""}
					</p>
					<Textarea
						value={noteQuery.data?.text ?? ""}
						readOnly
						className="min-h-56"
					/>
				</CardContent>
			</Card>
		</div>
	);
}

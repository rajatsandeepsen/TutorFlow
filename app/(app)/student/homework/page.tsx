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
	const homeworksQuery = useQuery({
		queryKey: ["student", "homeworks"],
		queryFn: () => client.student.getMyHomeworks({ limit: 100 }),
	});

	return (
		<div className="p-4">
			<Card>
				<CardHeader>
					<CardTitle>My Homework</CardTitle>
					<CardDescription>
						Answer your assignments and track your scores.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3">
					{homeworksQuery.data?.map((homework) => (
						<Card key={homework.id}>
							<CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
								<div className="min-w-0 flex-1 space-y-1">
									<p className="truncate font-medium">{homework.topic}</p>
									<p className="line-clamp-2 text-sm">{homework.question}</p>
									<div className="flex items-center gap-2 text-xs">
										<span className="rounded-md border px-2 py-1">
											{homework.score ?? "Not scored"}
										</span>
										<span className="rounded-md border px-2 py-1">
											{homework.anwser ? "Answered" : "Pending answer"}
										</span>
									</div>
								</div>
								<Button asChild size="sm">
									<Link href={`/student/sessions/${homework.slotId}/homework/${homework.id}`}>
										{homework.anwser ? "Update answer" : "Answer"}
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
					{homeworksQuery.data && homeworksQuery.data.length === 0 && (
						<p className="text-muted-foreground text-sm">
							No homework assigned yet.
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

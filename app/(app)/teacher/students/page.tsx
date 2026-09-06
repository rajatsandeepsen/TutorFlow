"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, client } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

export default function Page() {
	const [query, setQuery] = useState("");
	const [studentIdForDelete, setStudentIdForDelete] = useState("");

	const normalizedQuery = query.trim();

	const studentsQuery = useQuery({
		queryKey: ["teacher", "students", normalizedQuery],
		enabled: normalizedQuery.length > 0,
		queryFn: () =>
			client.teacher.searchStudentsByName({
				query: normalizedQuery,
				limit: 20,
			}),
	});

	return (
		<div className="grid gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>Students</CardTitle>
					<CardDescription>
						Search your students, then open profile or schedule a session.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="student-search">Search by name</Label>
						<Input
							id="student-search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="e.g. Aarav"
						/>
					</div>

					{normalizedQuery.length === 0 && (
						<p className="text-muted-foreground text-sm">
							Start typing a student name to search.
						</p>
					)}

					{studentsQuery.data && studentsQuery.data.length === 0 && (
						<p className="text-muted-foreground text-sm">No students found.</p>
					)}

					<div className="grid gap-3">
						{studentsQuery.data?.map((student) => (
							<Card key={student.id}>
								<CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium">{student.name}</p>
										<p className="truncate text-muted-foreground text-sm">
											{student.email}
										</p>
										{student.subject && (
											<p className="text-muted-foreground text-xs">
												{student.subject} •{" "}
												{student.currentLevel ?? "Level not set"}
											</p>
										)}
									</div>
									<div className="flex flex-wrap gap-2">
										<Button asChild variant="outline" size="sm">
											<Link href={`/teacher/slot/${student.id}`}>
												Schedule slot
											</Link>
										</Button>
										<Button asChild size="sm">
											<Link href={`/teacher/students/${student.id}`}>
												Open profile
											</Link>
										</Button>
										<Button asChild variant="secondary" size="sm">
											<Link href="/teacher/notes">Notes / homework</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Remove Student by ID</CardTitle>
					<CardDescription>
						Quick action when studentId is already known.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<Input
						value={studentIdForDelete}
						onChange={(event) => setStudentIdForDelete(event.target.value)}
						placeholder="student_..."
					/>
					<MutationButton
						api={api.teacher.deleteStudent.mutationOptions()}
						mutate={(mutate) => (
							<Button
								variant="destructive"
								disabled={studentIdForDelete.trim().length === 0}
								onClick={() => mutate({ studentId: studentIdForDelete.trim() })}
							>
								Remove student
							</Button>
						)}
						isPending={<Button disabled>Removing...</Button>}
						onSuccess={() => {
							setStudentIdForDelete("");
						}}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

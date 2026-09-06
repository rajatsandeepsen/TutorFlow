"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

export default function Page() {
	const router = useRouter();
	const params = useParams<{ studentId: string }>();
	const studentId = params.studentId;

	const [name, setName] = useState("");
	const [subject, setSubject] = useState("");
	const [currentLevel, setCurrentLevel] = useState("");
	const [learningGoals, setLearningGoals] = useState("");
	const [weakAreas, setWeakAreas] = useState("");

	const canSave =
		name.trim().length > 0 &&
		subject.trim().length > 0 &&
		currentLevel.trim().length > 0 &&
		learningGoals.trim().length > 0 &&
		weakAreas.trim().length > 0;

	const payload = {
		studentId,
		name: name.trim(),
		subject: subject.trim(),
		currentLevel: currentLevel.trim(),
		learningGoals: learningGoals.trim(),
		weakAreas: weakAreas.trim(),
	};

	return (
		<div className="grid gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>Student Learning Profile</CardTitle>
					<CardDescription>
						Update academic profile fields used during one-on-one tutoring.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="student-id">Student ID</Label>
						<Input id="student-id" value={studentId} readOnly />
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">Student name</Label>
						<Input
							id="name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="e.g. Riya Gupta"
						/>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="subject">Subject</Label>
							<Input
								id="subject"
								value={subject}
								onChange={(event) => setSubject(event.target.value)}
								placeholder="Mathematics"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="current-level">Current level</Label>
							<Input
								id="current-level"
								value={currentLevel}
								onChange={(event) => setCurrentLevel(event.target.value)}
								placeholder="Grade 8"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="goals">Learning goals</Label>
						<Textarea
							id="goals"
							value={learningGoals}
							onChange={(event) => setLearningGoals(event.target.value)}
							placeholder="Target outcomes for the next 4 weeks"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="weak-areas">Weak areas</Label>
						<Textarea
							id="weak-areas"
							value={weakAreas}
							onChange={(event) => setWeakAreas(event.target.value)}
							placeholder="Topics needing reinforcement"
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						<MutationButton
							api={api.teacher.updateStudentProfile.mutationOptions({
								onError: (error) => {
									toast.error(error.message);
								},
							})}
							onSuccess={() => {
								toast.success("Student profile saved");
							}}
							mutate={(mutate) => (
								<Button disabled={!canSave} onClick={() => mutate(payload)}>
									Save profile
								</Button>
							)}
							isPending={<Button disabled>Saving...</Button>}
						/>
						<MutationButton
							api={api.teacher.updateStudentExtraProfile.mutationOptions({
								onError: (error) => {
									toast.error(error.message);
								},
							})}
							onSuccess={() => {
								toast.success("Student extra profile saved");
							}}
							mutate={(mutate) => (
								<Button
									variant="outline"
									disabled={!canSave}
									onClick={() => mutate(payload)}
								>
									Save extra profile
								</Button>
							)}
							isPending={
								<Button variant="outline" disabled>
									Saving...
								</Button>
							}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Danger Zone</CardTitle>
					<CardDescription>
						Remove this student account from TutorFlow.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<MutationButton
						api={api.teacher.deleteStudent.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={() => {
							toast.success("Student removed");
							router.push("/teacher/students");
						}}
						mutate={(mutate) => (
							<Button
								variant="destructive"
								onClick={() => mutate({ studentId })}
							>
								Remove student
							</Button>
						)}
						isPending={
							<Button variant="destructive" disabled>
								Removing...
							</Button>
						}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

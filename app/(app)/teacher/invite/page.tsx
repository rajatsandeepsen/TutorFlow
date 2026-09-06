"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CenterContainer } from "@/components/container";
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
import { api } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

export default function InvitePage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const payload = {
		name: name.trim(),
		email: email.trim(),
	};

	const canInvite = payload.name.length > 0 && payload.email.length > 0;

	return (
		<CenterContainer>
			<Card>
				<CardHeader>
					<CardTitle>Add Student</CardTitle>
					<CardDescription>
						Create a student account and send their TutorFlow invite email.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="student-name">Student name</Label>
						<Input
							id="student-name"
							name="student-name"
							type="text"
							placeholder="e.g. Priya Sharma"
							value={name}
							onChange={(event) => setName(event.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="student-email">Student email</Label>
						<Input
							id="student-email"
							name="student-email"
							type="email"
							placeholder="student@email.com"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
						/>
					</div>

					<MutationButton
						api={api.teacher.createStudentAccount.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={(data) => {
							toast.success(
								data.created
									? `Student invited: ${data.student.email}`
									: `Student updated and invited again: ${data.student.email}`,
							);
							setName("");
							setEmail("");
						}}
						mutate={(mutate) => (
							<Button
								type="button"
								className="w-full"
								disabled={!canInvite}
								onClick={() => mutate(payload)}
							>
								Send invite
							</Button>
						)}
						isPending={
							<Button type="button" className="w-full" disabled>
								Sending invite...
							</Button>
						}
						reTry={(mutate) => (
							<Button
								type="button"
								className="w-full"
								variant="outline"
								disabled={!canInvite}
								onClick={() => mutate(payload)}
							>
								Try again
							</Button>
						)}
					/>
				</CardContent>
			</Card>
		</CenterContainer>
	);
}

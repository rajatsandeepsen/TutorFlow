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
	const [email, setEmail] = useState("");

	const payload = {
		email: email.trim(),
	};

	const canInvite = payload.email.length > 0;

	return (
		<CenterContainer>
			<Card>
				<CardHeader>
					<CardTitle>Invite Student</CardTitle>
					<CardDescription>
						Send an invite email with login link and join-teacher link.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
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
						isSuccess={
							<Button type="button" className="w-full" disabled>
								Invited
							</Button>
						}
						reTry={(mutate) => (
							<Button
								type="button"
								className="w-full"
								variant="destructive"
								disabled={!canInvite}
								onClick={() => mutate(payload)}
							>
								Error, Try again
							</Button>
						)}
					/>
				</CardContent>
			</Card>
		</CenterContainer>
	);
}

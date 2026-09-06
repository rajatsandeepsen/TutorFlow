"use client";

import { useParams } from "next/navigation";
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
import { api } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

export default function Page() {
	const params = useParams<{ homeworkId: string }>();
	const homeworkId = params.homeworkId;
	const [score, setScore] = useState("0");

	const parsed = Number(score);
	const validScore = Number.isInteger(parsed) && parsed >= 0 && parsed <= 100;

	return (
		<div className="p-4">
			<Card>
				<CardHeader>
					<CardTitle>Score Homework</CardTitle>
					<CardDescription>
						Submit a score between 0 and 100 for this homework answer.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="homework-id">Homework ID</Label>
						<Input id="homework-id" value={homeworkId} readOnly />
					</div>
					<div className="space-y-2">
						<Label htmlFor="score">Score</Label>
						<Input
							id="score"
							type="number"
							min={0}
							max={100}
							step={1}
							value={score}
							onChange={(event) => setScore(event.target.value)}
						/>
					</div>
					<MutationButton
						api={api.teacher.scoreHomeworkAnswer.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={() => {
							toast.success("Homework score saved");
						}}
						mutate={(mutate) => (
							<Button
								disabled={!validScore}
								onClick={() => mutate({ homeworkId, score: parsed })}
							>
								Save score
							</Button>
						)}
						isPending={<Button disabled>Saving...</Button>}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

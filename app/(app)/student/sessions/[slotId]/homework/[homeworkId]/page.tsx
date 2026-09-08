"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, client } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

export default function Page() {
	const params = useParams<{ slotId: string; homeworkId: string }>();
	const homeworkId = params.homeworkId;
	const slotId = params.slotId;
	const [anwser, setAnwser] = useState("");

	const homeworksQuery = useQuery({
		queryKey: ["student", "homeworks", "all"],
		queryFn: () => client.student.getMyHomeworks({ limit: 200 }),
	});

	const homework = useMemo(() => {
		return homeworksQuery.data?.find((item) => item.id === homeworkId);
	}, [homeworksQuery.data, homeworkId]);

	return (
		<div className="p-4">
			<Card>
				<CardHeader>
					<CardTitle>Answer Homework</CardTitle>
					<CardDescription>
						{homework?.topic ?? "Homework"} • Slot {slotId}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm">
						{homework?.question ?? "Loading question..."}
					</p>
					<div className="space-y-2">
						<Label htmlFor="answer">Your answer</Label>
						<Textarea
							id="answer"
							value={anwser}
							onChange={(event) => setAnwser(event.target.value)}
							placeholder={homework?.anwser ?? "Write your answer"}
							className="min-h-56"
						/>
					</div>
					<MutationButton
						api={api.student.answerHomework.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={async () => {
							toast.success("Homework answer submitted");
							setAnwser("");
							await homeworksQuery.refetch();
						}}
						mutate={(mutate) => (
							<Button
								disabled={anwser.trim().length === 0}
								onClick={() => mutate({ homeworkId, anwser: anwser.trim() })}
							>
								Submit answer
							</Button>
						)}
						isPending={<Button disabled>Submitting...</Button>}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

export default function Page() {
	const params = useParams<{ slotId?: string }>();
	const [slotIdInput, setSlotIdInput] = useState("");
	const [noteText, setNoteText] = useState("");
	const [homeworkQuestion, setHomeworkQuestion] = useState("");
	const [homeworkLink, setHomeworkLink] = useState("");

	const slotId = (params.slotId ?? slotIdInput).trim();
	const canAddNote = slotId.length > 0 && noteText.trim().length > 0;
	const canCreateHomework =
		slotId.length > 0 && homeworkQuestion.trim().length > 0;

	return (
		<div className="grid gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>Session Notes</CardTitle>
					<CardDescription>
						Capture what happened in class for this session.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="slot-id">Slot ID</Label>
						<Input
							id="slot-id"
							value={slotId}
							onChange={(event) => setSlotIdInput(event.target.value)}
							readOnly={!!params.slotId}
							placeholder="slot_..."
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="note-text">Note</Label>
						<Textarea
							id="note-text"
							value={noteText}
							onChange={(event) => setNoteText(event.target.value)}
							placeholder="Student progress, blockers, next steps"
						/>
					</div>
					<MutationButton
						api={api.teacher.addSessionNote.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={() => {
							toast.success("Session note saved");
							setNoteText("");
						}}
						mutate={(mutate) => (
							<Button
								type="button"
								disabled={!canAddNote}
								onClick={() => mutate({ slotId, text: noteText.trim() })}
							>
								Save note
							</Button>
						)}
						isPending={
							<Button type="button" disabled>
								Saving...
							</Button>
						}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Assign Homework</CardTitle>
					<CardDescription>
						Create a homework task for this completed session.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="homework-question">Question</Label>
						<Textarea
							id="homework-question"
							value={homeworkQuestion}
							onChange={(event) => setHomeworkQuestion(event.target.value)}
							placeholder="Practice questions or assignment details"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="homework-link">Homework link (optional)</Label>
						<Input
							id="homework-link"
							type="url"
							value={homeworkLink}
							onChange={(event) => setHomeworkLink(event.target.value)}
							placeholder="https://docs.google.com/..."
						/>
					</div>
					<MutationButton
						api={api.teacher.createHomework.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={(data) => {
							toast.success(`Homework created: ${data.id}`);
							setHomeworkQuestion("");
							setHomeworkLink("");
						}}
						mutate={(mutate) => (
							<Button
								type="button"
								disabled={!canCreateHomework}
								onClick={() =>
									mutate({
										slotId,
										question: homeworkQuestion.trim(),
										homeworkLink: homeworkLink.trim() || undefined,
									})
								}
							>
								Create homework
							</Button>
						)}
						isPending={
							<Button type="button" disabled>
								Creating...
							</Button>
						}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

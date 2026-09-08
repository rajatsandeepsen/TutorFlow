"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { api } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

export default function Page() {
	const params = useParams<{ teacherId: string }>();
	const teacherId = params.teacherId;

	return (
		<div className="p-4">
			<Card>
				<CardHeader>
					<CardTitle>Accept Tutor Invite</CardTitle>
					<CardDescription>
						Join this teacher for one-on-one classes on TutorFlow.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<p className="text-muted-foreground text-sm">
						Teacher ID: {teacherId}
					</p>
					<MutationButton
						api={api.student.joinTeacher.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={(data) => {
							if (data.joined) {
								toast.success("You joined this teacher successfully");
								return;
							}
							toast.success("You are already connected with this teacher");
						}}
						mutate={(mutate) => (
							<Button onClick={() => mutate({ teacherId })}>
								Join teacher
							</Button>
						)}
						isPending={<Button disabled>Joining...</Button>}
						reTry={(mutate) => (
							<Button variant="outline" onClick={() => mutate({ teacherId })}>
								Try again
							</Button>
						)}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

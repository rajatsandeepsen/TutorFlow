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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api, client } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

const RESPONSE_LABEL = {
	confirmed: "Confirm",
	rejected: "Reject",
} as const;

export default function Page() {
	const params = useParams<{ slotId: string }>();
	const slotId = params.slotId;
	const [response, setResponse] = useState<"confirmed" | "rejected">(
		"confirmed",
	);

	const slotsQuery = useQuery({
		queryKey: ["student", "slots", "all"],
		queryFn: () => client.student.getMySlotsList({ limit: 200 }),
	});

	const slot = useMemo(() => {
		return slotsQuery.data?.find((item) => item.id === slotId);
	}, [slotsQuery.data, slotId]);

	const canRespond = slot?.status === "pending";
	const canCancel = slot?.status === "pending" || slot?.status === "confirmed";

	return (
		<div className="grid gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>Session Details</CardTitle>
					<CardDescription>
						Review and respond to your scheduled one-on-one class.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 text-sm">
					<p>
						<span className="font-medium">Teacher:</span>{" "}
						{slot?.teacherName ?? "-"}
					</p>
					<p>
						<span className="font-medium">Topic:</span> {slot?.topic ?? "-"}
					</p>
					<p>
						<span className="font-medium">Status:</span> {slot?.status ?? "-"}
					</p>
					<p>
						<span className="font-medium">Start:</span>{" "}
						{slot ? new Date(slot.startTime).toLocaleString() : "-"}
					</p>
					<p>
						<span className="font-medium">End:</span>{" "}
						{slot ? new Date(slot.endTime).toLocaleString() : "-"}
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Session Actions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label>Response</Label>
						<Select
							value={response}
							onValueChange={(value) =>
								setResponse(value as "confirmed" | "rejected")
							}
						>
							<SelectTrigger className="w-44">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="confirmed">
									{RESPONSE_LABEL.confirmed}
								</SelectItem>
								<SelectItem value="rejected">
									{RESPONSE_LABEL.rejected}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<MutationButton
						api={api.student.respondToSlot.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={async () => {
							toast.success(`Session ${response}`);
							await slotsQuery.refetch();
						}}
						mutate={(mutate) => (
							<Button
								disabled={!canRespond}
								onClick={() => mutate({ slotId, status: response })}
							>
								Submit response
							</Button>
						)}
						isPending={<Button disabled>Saving...</Button>}
					/>

					<MutationButton
						api={api.student.cancelMySlot.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={async () => {
							toast.success("Session cancelled");
							await slotsQuery.refetch();
						}}
						mutate={(mutate) => (
							<Button
								variant="destructive"
								disabled={!canCancel}
								onClick={() => mutate({ slotId })}
							>
								Cancel session
							</Button>
						)}
						isPending={
							<Button variant="destructive" disabled>
								Cancelling...
							</Button>
						}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

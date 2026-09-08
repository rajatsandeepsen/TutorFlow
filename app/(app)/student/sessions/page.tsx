"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { api, client } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

const SLOT_STATUS_LABEL = {
	pending: "Pending",
	confirmed: "Confirmed",
	in_progress: "In Progress",
	cancelled: "Cancelled",
	rejected: "Rejected",
	expired: "Expired",
	attended: "Attended",
} as const;

type SlotStatus = keyof typeof SLOT_STATUS_LABEL;

type EditableStatus = "confirmed" | "rejected" | "cancelled";

type SlotActionOption = {
	value: EditableStatus;
	label: string;
};

const getActionOptions = (status: SlotStatus): SlotActionOption[] => {
	if (status === "pending") {
		return [
			{ value: "confirmed", label: "Confirm" },
			{ value: "rejected", label: "Reject" },
			{ value: "cancelled", label: "Cancel" },
		];
	}

	if (status === "confirmed") {
		return [{ value: "cancelled", label: "Cancel" }];
	}

	return [];
};

const getDefaultAction = (status: SlotStatus): EditableStatus | "" => {
	if (status === "pending") return "confirmed";
	if (status === "confirmed") return "cancelled";
	return "";
};

export default function Page() {
	const [selectedActionBySlotId, setSelectedActionBySlotId] = useState<
		Record<string, EditableStatus | "">
	>({});

	const slotsQuery = useQuery({
		queryKey: ["student", "slots", "all"],
		queryFn: () => client.student.getMySlotsList({ limit: 200 }),
	});

	const slots = useMemo(() => {
		return slotsQuery.data ?? [];
	}, [slotsQuery.data]);

	return (
		<div className="grid gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>My Sessions</CardTitle>
					<CardDescription>
						Browse every session and update the ones that are still editable.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-3">
					{slots.map((slot) => {
						const status = slot.status as SlotStatus;
						const actionOptions = getActionOptions(status);
						const selectedAction =
							selectedActionBySlotId[slot.id] ?? getDefaultAction(status);
						const canEdit = actionOptions.length > 0;

						return (
							<Card key={slot.id}>
								<CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
									<div className="min-w-0 flex-1 space-y-1">
										<p className="truncate font-medium">{slot.topic}</p>
										<p className="truncate text-muted-foreground text-xs">
											Teacher: {slot.teacherName}
										</p>
										<p className="text-muted-foreground text-xs">
											{new Date(slot.startTime).toLocaleString()} -{" "}
											{new Date(slot.endTime).toLocaleString()}
										</p>
										<p className="text-sm">
											<span className="font-medium">Status:</span>{" "}
											{SLOT_STATUS_LABEL[status]}
										</p>
										{slot.description && (
											<p className="line-clamp-2 text-sm text-muted-foreground">
												{slot.description}
											</p>
										)}
									</div>

									<div className="flex w-full flex-col gap-2 md:w-[18rem]">
										<LabelledStatus status={status} />
										<Select
											value={selectedAction || undefined}
											onValueChange={(value) => {
												setSelectedActionBySlotId((prev) => ({
													...prev,
													[slot.id]: value as EditableStatus,
												}));
											}}
											disabled={!canEdit}
										>
											<SelectTrigger>
												<SelectValue placeholder="Set status" />
											</SelectTrigger>
											<SelectContent>
												{actionOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										{canEdit ? (
											selectedAction === "cancelled" ? (
												<MutationButton
													api={api.student.cancelMySlot.mutationOptions({
														onError: (error) => {
															toast.error(error.message);
														},
													})}
													onSuccess={async () => {
														toast.success("Session updated");
														await slotsQuery.refetch();
													}}
													mutate={(mutate) => (
														<Button disabled={!selectedAction} onClick={() => mutate({ slotId: slot.id })}>
															Update status
														</Button>
													)}
													isPending={<Button disabled>Updating...</Button>}
												/>
											) : (
												<MutationButton
													api={api.student.respondToSlot.mutationOptions({
														onError: (error) => {
															toast.error(error.message);
														},
													})}
													onSuccess={async () => {
														toast.success("Session updated");
														await slotsQuery.refetch();
													}}
													mutate={(mutate) => (
														<Button
															disabled={!selectedAction}
															onClick={() =>
																mutate({
																	slotId: slot.id,
																	status: selectedAction as Exclude<EditableStatus, "cancelled">,
																})
															}
														>
															Update status
														</Button>
													)}
													isPending={<Button disabled>Updating...</Button>}
												/>
											)
										) : (
											<Button disabled variant="outline">
												No editable actions
											</Button>
										)}

										<Button asChild variant="outline">
											<Link href={`/student/sessions/${slot.id}`}>Open</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						);
					})}

					{slots.length === 0 && (
						<p className="text-muted-foreground text-sm">No sessions yet.</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function LabelledStatus({ status }: { status: SlotStatus }) {
	return (
		<p className="text-muted-foreground text-xs">
			Current: <span className="font-medium">{SLOT_STATUS_LABEL[status]}</span>
		</p>
	);
}

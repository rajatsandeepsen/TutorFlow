"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ListIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	EventCalendar,
	type EventCalendarApi,
	type EventCalendarRenderEventProps,
} from "@/components/reui/event-calendar/event-calendar";
import { EventCalendarContent } from "@/components/reui/event-calendar/event-calendar-content";
import {
	EventCalendarNav,
	EventCalendarToolbar,
} from "@/components/reui/event-calendar/event-calendar-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const SLOT_STATUS_COLOR = {
	pending: "var(--color-amber-500)",
	confirmed: "var(--color-sky-500)",
	in_progress: "var(--color-violet-500)",
	cancelled: "var(--color-rose-500)",
	rejected: "var(--color-rose-700)",
	expired: "var(--color-zinc-500)",
	attended: "var(--color-emerald-500)",
} as const;

const UPDATABLE_STATUS = [
	"in_progress",
	"attended",
	"cancelled",
	"expired",
] as const;

type UpdatableStatus = (typeof UPDATABLE_STATUS)[number];

type SlotStatus = keyof typeof SLOT_STATUS_LABEL;

interface SlotEventData {
	studentName: string;
	topic: string;
	status: SlotStatus;
}

const getInitials = (value: string) => {
	return value
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
};

function AgendaStatusActions({
	slotId,
	status,
	onStatusChange,
	onUpdated,
}: {
	slotId: string;
	status: UpdatableStatus;
	onStatusChange: (next: UpdatableStatus) => void;
	onUpdated: () => Promise<void>;
}) {
	return (
		<div className="flex items-center gap-2">
			<Select
				value={status}
				onValueChange={(value) => onStatusChange(value as UpdatableStatus)}
			>
				<SelectTrigger
					size="sm"
					className="w-[145px]"
					onPointerDown={(event) => event.stopPropagation()}
					onClick={(event) => event.stopPropagation()}
				>
					<SelectValue placeholder="Set status" />
				</SelectTrigger>
				<SelectContent
					onPointerDown={(event) => event.stopPropagation()}
					onClick={(event) => event.stopPropagation()}
				>
					{UPDATABLE_STATUS.map((item) => (
						<SelectItem key={item} value={item}>
							{SLOT_STATUS_LABEL[item]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<MutationButton
				api={api.teacher.updateSlotStatus.mutationOptions({
					onError: (error) => {
						toast.error(error.message);
					},
				})}
				onSuccess={async () => {
					toast.success("Session status updated");
					await onUpdated();
				}}
				mutate={(mutate) => (
					<Button
						size="sm"
						variant="outline"
						onPointerDown={(event) => event.stopPropagation()}
						onClick={(event) => {
							event.stopPropagation();
							mutate({ slotId, status });
						}}
					>
						Update
					</Button>
				)}
				isPending={
					<Button size="sm" variant="outline" disabled>
						Updating...
					</Button>
				}
			/>
		</div>
	);
}

function renderChip({
	occurrence,
}: EventCalendarRenderEventProps<SlotEventData>) {
	const data = occurrence.event.data;
	if (!data) return undefined;

	return (
		<span className="flex h-full w-full min-w-0 flex-col justify-start gap-0.5">
			<span className="flex min-w-0 items-center gap-1.5">
				<Avatar className="size-5 shrink-0">
					<AvatarFallback className="font-semibold text-[9px]">
						{getInitials(data.studentName)}
					</AvatarFallback>
				</Avatar>
				<span className="truncate font-medium">{data.studentName}</span>
			</span>
			<span className="truncate ps-[1.625rem] text-[11px]">{data.topic}</span>
		</span>
	);
}

export default function Page() {
	const apiRef = useRef<EventCalendarApi<SlotEventData> | null>(null);
	const [draftStatusBySlotId, setDraftStatusBySlotId] = useState<
		Record<string, UpdatableStatus>
	>({});

	const slotsQuery = useQuery({
		queryKey: ["teacher", "slots", "calendar"],
		queryFn: () => client.teacher.getSlotsList({ limit: 200 }),
	});

	const events = useMemo(() => {
		return (slotsQuery.data ?? []).map((item) => {
			const status = item.status as SlotStatus;

			return {
				id: item.id,
				title: item.studentName,
				start: new Date(item.startTime),
				end: new Date(item.endTime),
				color: SLOT_STATUS_COLOR[status],
				data: {
					studentName: item.studentName,
					topic: item.topic,
					status,
				},
			};
		});
	}, [slotsQuery.data]);

	const calendarKey = useMemo(() => {
		return events.map((event) => event.id).join("|");
	}, [events]);

	const getNextStatus = (slotId: string, currentStatus: SlotStatus) => {
		const draft = draftStatusBySlotId[slotId];
		if (draft) return draft;
		if (UPDATABLE_STATUS.includes(currentStatus as UpdatableStatus)) {
			return currentStatus as UpdatableStatus;
		}
		return "in_progress";
	};

	return (
		<div className="w-full p-4">
			<Card className="w-full py-0">
				<CardContent className="p-0">
					<EventCalendar
						key={calendarKey}
						defaultEvents={events}
						defaultView="day"
						dayStartHour={7}
						dayEndHour={22}
						interval={30}
						snapDuration={15}
						apiRef={apiRef}
						renderEvent={renderChip}
						renderAgendaEvent={({ occurrence }) => {
							const slotId = occurrence.event.id;
							const status = occurrence.event.data?.status ?? "pending";
							const currentDraft = getNextStatus(slotId, status);
							const timeLabel = `${format(occurrence.start, "hh:mm a")} - ${format(occurrence.end, "hh:mm a")}`;

							return (
								<div className="flex w-full min-w-0 items-center gap-3">
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">
											{occurrence.event.title}
										</p>
										<p className="truncate text-muted-foreground text-xs">
											{timeLabel} •{" "}
											{occurrence.event.data?.topic ?? "1:1 Session"} •{" "}
											{SLOT_STATUS_LABEL[status]}
										</p>
									</div>
									<AgendaStatusActions
										slotId={slotId}
										status={currentDraft}
										onStatusChange={(next) => {
											setDraftStatusBySlotId((prev) => ({
												...prev,
												[slotId]: next,
											}));
										}}
										onUpdated={async () => {
											await slotsQuery.refetch();
										}}
									/>
								</div>
							);
						}}
						interactions={{ drag: false, resize: false, selectSlot: false }}
						className="h-[640px] w-full"
					>
						<div className="flex flex-wrap items-center gap-2 pe-2">
							<EventCalendarNav className="min-w-0 flex-1" />
							<EventCalendarToolbar>
								<Button
									variant="outline"
									size="sm"
									onClick={() => apiRef.current?.setView("agenda")}
								>
									<ListIcon className="size-4" aria-hidden="true" />
									Agenda
								</Button>
							</EventCalendarToolbar>
						</div>
						<EventCalendarContent />
					</EventCalendar>
					<p className="border-t px-4 py-3 text-muted-foreground text-xs">
						Manage your scheduled 1:1 sessions and update live session status.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { ListIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef } from "react";
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
import { client } from "@/hooks/api";

const STATUS_LABEL = {
	pending: "Pending",
	confirmed: "Confirmed",
	in_progress: "In Progress",
	cancelled: "Cancelled",
	rejected: "Rejected",
	expired: "Expired",
	attended: "Attended",
} as const;

const STATUS_COLOR = {
	pending: "var(--color-amber-500)",
	confirmed: "var(--color-sky-500)",
	in_progress: "var(--color-violet-500)",
	cancelled: "var(--color-rose-500)",
	rejected: "var(--color-rose-700)",
	expired: "var(--color-zinc-500)",
	attended: "var(--color-emerald-500)",
} as const;

type SlotStatus = keyof typeof STATUS_LABEL;

interface SessionData {
	teacherName: string;
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

function renderChip({
	occurrence,
}: EventCalendarRenderEventProps<SessionData>) {
	const data = occurrence.event.data;
	if (!data) return undefined;

	return (
		<span className="flex h-full w-full min-w-0 flex-col justify-start gap-0.5">
			<span className="flex min-w-0 items-center gap-1.5">
				<Avatar className="size-5 shrink-0">
					<AvatarFallback className="font-semibold text-[9px]">
						{getInitials(data.teacherName)}
					</AvatarFallback>
				</Avatar>
				<span className="truncate font-medium">{data.teacherName}</span>
			</span>
			<span className="truncate ps-[1.625rem] text-[11px]">{data.topic}</span>
		</span>
	);
}

export default function Page() {
	const apiRef = useRef<EventCalendarApi<SessionData> | null>(null);

	const slotsQuery = useQuery({
		queryKey: ["student", "slots", "calendar"],
		queryFn: () => client.student.getMySlotsList({ limit: 200 }),
	});

	const events = useMemo(() => {
		return (slotsQuery.data ?? []).map((item) => {
			const status = item.status as SlotStatus;
			return {
				id: item.id,
				title: item.teacherName,
				start: new Date(item.startTime),
				end: new Date(item.endTime),
				color: STATUS_COLOR[status],
				data: {
					teacherName: item.teacherName,
					topic: item.topic,
					status,
				},
			};
		});
	}, [slotsQuery.data]);

	const calendarKey = useMemo(
		() => events.map((event) => event.id).join("|"),
		[events],
	);

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
							return (
								<div className="flex w-full min-w-0 items-center gap-3">
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">
											{occurrence.event.title}
										</p>
										<p className="truncate text-muted-foreground text-xs">
											{occurrence.event.data?.topic ?? "Session"} •{" "}
											{STATUS_LABEL[status]}
										</p>
									</div>
									<Button asChild variant="outline" size="sm">
										<Link href={`/student/sessions/${slotId}`}>Open</Link>
									</Button>
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
						View your one-on-one class schedule and open sessions to respond.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

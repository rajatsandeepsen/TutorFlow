"use client";

import { format } from "date-fns";
import { ListIcon } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { BookedSlot } from "@/hooks/use-slot-booking";
import type { USER } from "@/lib/auth";

const withTime = (offsetDays: number, hour: number, minute: number) => {
	const value = new Date();
	value.setHours(0, 0, 0, 0);
	value.setDate(value.getDate() + offsetDays);
	value.setHours(hour, minute, 0, 0);
	return value;
};

const teacherUser: USER = {
	id: "teacher-1",
	name: "Dr. Emma Brooks",
	email: "emma.brooks@example.com",
	emailVerified: true,
	image: "https://randomuser.me/api/portraits/women/44.jpg",
	createdAt: new Date(),
	updatedAt: new Date(),
	role: "teacher",
};

const initialBookedSlots: BookedSlot[] = [
	{
		user: teacherUser,
		startTime: withTime(0, 10, 0),
		endTime: withTime(0, 11, 0),
	},
];

const SERVICE = {
	consultation: { label: "Consultation", color: "var(--color-violet-500)" },
	followup: { label: "Follow-up", color: "var(--color-sky-500)" },
	assessment: { label: "Assessment", color: "var(--color-amber-500)" },
	therapy: { label: "Therapy", color: "var(--color-rose-500)" },
} as const;

type Service = keyof typeof SERVICE;

const BOOKING_STATUSES = [
	"pending",
	"confirmed",
	"in_progress",
	"cancelled",
	"rejected",
	"expired",
	"attended",
] as const;

type BookingStatus = (typeof BOOKING_STATUSES)[number];

const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
	pending: "Pending",
	confirmed: "Confirmed",
	in_progress: "In Progress",
	cancelled: "Cancelled",
	rejected: "Rejected",
	expired: "Expired",
	attended: "Attended",
};

interface ApptData {
	client: string;
	initials: string;
	avatar?: string;
	service?: Service;
}

const SERVICE_CYCLE: Service[] = [
	"consultation",
	"followup",
	"assessment",
	"therapy",
];

const getInitials = (name: string) =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");

const buildAppointments = (slots: BookedSlot[]) => {
	return slots.map((slot, index) => {
		const service = SERVICE_CYCLE[index % SERVICE_CYCLE.length];
		const client = slot.user.name;

		return {
			id: `slot-${slot.user.id}-${index}`,
			title: client,
			start: slot.startTime,
			end: slot.endTime,
			color: SERVICE[service].color,
			data: {
				client,
				initials: getInitials(client),
				avatar: slot.user.image ?? undefined,
				service,
			},
		};
	});
};

const initialEvents = buildAppointments(initialBookedSlots);

const createInitialStatusMap = () => {
	return initialEvents.reduce<Record<string, BookingStatus>>(
		(acc, event, index) => {
			acc[event.id] = BOOKING_STATUSES[index % BOOKING_STATUSES.length];
			return acc;
		},
		{},
	);
};

interface AgendaActionButtonProps {
	eventId: string;
	status: BookingStatus;
}

type RenderAgendaActionButton = (props: AgendaActionButtonProps) => ReactNode;

interface AgendaBookingRowProps {
	occurrence: EventCalendarRenderEventProps<ApptData>["occurrence"];
	status: BookingStatus;
	onStatusChange: (eventId: string, status: BookingStatus) => void;
	renderActionButton: RenderAgendaActionButton;
}

function AgendaBookingRow({
	occurrence,
	status,
	onStatusChange,
	renderActionButton,
}: AgendaBookingRowProps) {
	const data = occurrence.event.data;
	const client = data?.client ?? occurrence.event.title;
	const serviceLabel = data?.service ? SERVICE[data.service].label : "Session";
	const timeLabel = `${format(occurrence.start, "hh:mm a")} - ${format(occurrence.end, "hh:mm a")}`;
	const eventId = occurrence.event.id;

	return (
		<div className="flex w-full min-w-0 items-center gap-3">
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium text-sm">{client}</p>
				<p className="truncate text-muted-foreground text-xs">
					{timeLabel} • {serviceLabel}
				</p>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				<Select
					value={status}
					onValueChange={(nextStatus) =>
						onStatusChange(eventId, nextStatus as BookingStatus)
					}
				>
					<SelectTrigger
						size="sm"
						className="w-[145px] text-xs"
						onPointerDown={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
					>
						<SelectValue placeholder="Select status" />
					</SelectTrigger>
					<SelectContent
						onPointerDown={(e) => e.stopPropagation()}
						onClick={(e) => e.stopPropagation()}
					>
						{BOOKING_STATUSES.map((bookingStatus) => (
							<SelectItem key={bookingStatus} value={bookingStatus}>
								{BOOKING_STATUS_LABEL[bookingStatus]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{renderActionButton({ eventId, status })}
			</div>
		</div>
	);
}

function renderChip({
	occurrence,
	segment,
}: EventCalendarRenderEventProps<ApptData>) {
	const data = occurrence.event.data;
	if (!data) return undefined;
	const service = data.service ? SERVICE[data.service] : null;
	const minutes = (segment.endMin ?? 0) - (segment.startMin ?? 0);

	return (
		<span className="flex h-full w-full min-w-0 flex-col justify-start gap-0.5">
			<span className="flex min-w-0 items-center gap-1.5">
				<Avatar className="size-5 shrink-0">
					{data.avatar && <AvatarImage src={data.avatar} alt={data.client} />}
					<AvatarFallback className="bg-(--ec-event-color)/25 font-semibold text-(--ec-event-color) text-[9px]">
						{data.initials}
					</AvatarFallback>
				</Avatar>
				<span className="truncate font-medium">{data.client}</span>
			</span>
			{service && minutes >= 45 && (
				<span className="truncate ps-[1.625rem] font-medium text-(--ec-event-color) text-[11px]">
					{service.label}
				</span>
			)}
		</span>
	);
}

export default function Pattern() {
	const apiRef = useRef<EventCalendarApi<ApptData> | null>(null);
	const [statusByEventId, setStatusByEventId] = useState(
		createInitialStatusMap,
	);

	const onStatusChange = (eventId: string, status: BookingStatus) => {
		setStatusByEventId((prev) => ({ ...prev, [eventId]: status }));
	};

	const renderAgendaActionButton: RenderAgendaActionButton = () => {
		return (
			<Button
				size="sm"
				variant="outline"
				onPointerDown={(e) => e.stopPropagation()}
				onClick={(e) => e.stopPropagation()}
			>
				Update
			</Button>
		);
	};

	return (
		<div className="w-full p-4">
			<Card className="w-full py-0">
				<CardContent className="p-0">
					<EventCalendar
						defaultEvents={initialEvents}
						defaultView="day"
						dayStartHour={9}
						dayEndHour={18}
						interval={30}
						snapDuration={15}
						apiRef={apiRef}
						renderEvent={renderChip}
						renderAgendaEvent={({ occurrence }) => {
							const eventId = occurrence.event.id;
							const status = statusByEventId[eventId] ?? "pending";

							return (
								<AgendaBookingRow
									occurrence={occurrence}
									status={status}
									onStatusChange={onStatusChange}
									renderActionButton={renderAgendaActionButton}
								/>
							);
						}}
						interactions={{ drag: false, resize: false, selectSlot: false }}
						className="h-[600px] w-full"
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
						Read-only calendar view of booked appointments.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

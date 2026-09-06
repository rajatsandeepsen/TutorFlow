"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api, client } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";
import { useTeacherSlotBooking } from "@/hooks/use-slot-booking";

const DURATION_TO_MINUTES = {
	"30 mins": 30,
	"1 hour": 60,
	"2 hours": 120,
	"3 hours": 180,
	"6 hours": 360,
} as const;

const ACTIVE_SLOT_STATUSES = ["pending", "confirmed", "in_progress"] as const;

type ActiveSlotStatus = (typeof ACTIVE_SLOT_STATUSES)[number];

const isActiveSlotStatus = (status: string): status is ActiveSlotStatus => {
	return ACTIVE_SLOT_STATUSES.includes(status as ActiveSlotStatus);
};

const parseStartTime = (date: Date, time: string) => {
	const [hourText, minuteText] = time.split(":");
	const value = new Date(date);
	value.setHours(Number(hourText), Number(minuteText), 0, 0);
	return value;
};

export default function Page() {
	const params = useParams<{ studentId?: string }>();
	const [studentIdInput, setStudentIdInput] = useState("");
	const [topic, setTopic] = useState("");
	const [description, setDescription] = useState("");
	const [joinLink, setJoinLink] = useState("");
	const [activeTimePeriod, setActiveTimePeriod] = useState("morning");

	const studentId = (params.studentId ?? studentIdInput).trim();

	const slotsQuery = useQuery({
		queryKey: ["teacher", "slots", "for-scheduling"],
		queryFn: () => client.teacher.getSlotsList({ limit: 200 }),
	});

	const bookedSlots = useMemo(() => {
		return (slotsQuery.data ?? [])
			.filter((item) => isActiveSlotStatus(item.status))
			.map((item) => ({
				startTime: new Date(item.startTime),
				endTime: new Date(item.endTime),
			}));
	}, [slotsQuery.data]);

	const {
		date,
		setDate,
		selectedTime,
		setSelectedTime,
		selectedDuration,
		setSelectedDuration,
		durations,
		timePeriodGroups,
		quickDateOptions,
		isSameDay,
		isTimeUnavailable,
		isDateDisabled,
		confirmDisabled,
		bookingStatusMessage,
	} = useTeacherSlotBooking(bookedSlots);

	const activeTimeGroup =
		timePeriodGroups.find((group) => group.key === activeTimePeriod) ??
		timePeriodGroups[0];

	const payload = useMemo(() => {
		if (!date || !selectedTime) return null;
		if (!studentId || !topic.trim()) return null;

		const startTime = parseStartTime(date, selectedTime);
		const durationMinutes =
			DURATION_TO_MINUTES[
				selectedDuration as keyof typeof DURATION_TO_MINUTES
			] ?? 60;
		const endTime = new Date(startTime);
		endTime.setMinutes(endTime.getMinutes() + durationMinutes);

		return {
			studentId,
			startTime,
			endTime,
			topic: topic.trim(),
			description: description.trim() || undefined,
			joinLink: joinLink.trim() || undefined,
		};
	}, [
		date,
		selectedTime,
		selectedDuration,
		studentId,
		topic,
		description,
		joinLink,
	]);

	const canSchedule = !!payload && !confirmDisabled;

	return (
		<Card className="gap-0 p-0">
			<CardHeader className="border-b">
				<CardTitle>Schedule 1:1 Session</CardTitle>
				<CardDescription>
					Pick a time slot and schedule a class for your student.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4 p-4">
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="student-id">Student ID</Label>
						<Input
							id="student-id"
							value={studentId}
							onChange={(event) => setStudentIdInput(event.target.value)}
							readOnly={!!params.studentId}
							placeholder="student_..."
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="topic">Session topic</Label>
						<Input
							id="topic"
							value={topic}
							onChange={(event) => setTopic(event.target.value)}
							placeholder="Algebra: Linear equations"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Session plan (optional)</Label>
					<Textarea
						id="description"
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						placeholder="Learning goals or agenda"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="join-link">Join link (optional)</Label>
					<Input
						id="join-link"
						type="url"
						value={joinLink}
						onChange={(event) => setJoinLink(event.target.value)}
						placeholder="https://meet.google.com/..."
					/>
				</div>

				<div className="grid gap-4 md:grid-cols-[1fr_13rem]">
					<div className="space-y-4">
						<Calendar
							className="w-full"
							mode="single"
							selected={date}
							onSelect={setDate}
							defaultMonth={date}
							disabled={isDateDisabled}
							showOutsideDays={false}
						/>
						<div className="space-y-2">
							<p className="font-medium text-sm">Quick dates</p>
							<div className="flex flex-wrap gap-2">
								{quickDateOptions.map((option) => {
									const active = !!date && isSameDay(option.date, date);

									return (
										<Button
											key={option.label}
											variant={active ? "default" : "outline"}
											onClick={() => setDate(option.date)}
										>
											{option.label}
										</Button>
									);
								})}
							</div>
						</div>
						<div className="space-y-2">
							<p className="font-medium text-sm">Duration</p>
							<div className="flex flex-wrap gap-2">
								{durations.map((duration) => (
									<Button
										key={duration}
										variant={
											selectedDuration === duration ? "default" : "outline"
										}
										onClick={() => setSelectedDuration(duration)}
									>
										{duration}
									</Button>
								))}
							</div>
						</div>
					</div>
					<div className="min-h-0 rounded-md border">
						<Tabs
							value={activeTimePeriod}
							onValueChange={setActiveTimePeriod}
							className="flex h-full min-h-[18rem] flex-col"
						>
							<TabsList className="m-3 w-auto">
								{timePeriodGroups.map((group) => (
									<TabsTrigger key={group.key} value={group.key}>
										{group.label}
									</TabsTrigger>
								))}
							</TabsList>
							<ScrollArea className="min-h-0 flex-1">
								<div className="flex flex-col gap-2 p-3 pt-0">
									{activeTimeGroup.times.map((time) => {
										const unavailable = isTimeUnavailable(time);

										return (
											<Button
												key={time}
												variant={selectedTime === time ? "default" : "outline"}
												onClick={() => setSelectedTime(time)}
												disabled={unavailable}
											>
												{time}
											</Button>
										);
									})}
								</div>
							</ScrollArea>
						</Tabs>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-4 border-t md:flex-row md:items-center">
				<p className="text-muted-foreground text-sm">{bookingStatusMessage}</p>
				<MutationButton
					api={api.teacher.createSession.mutationOptions({
						onError: (error) => {
							toast.error(error.message);
						},
					})}
					onSuccess={async (data) => {
						toast.success(
							`Session scheduled for ${new Date(data.startTime).toLocaleString()}`,
						);
						setTopic("");
						setDescription("");
						setJoinLink("");
						await slotsQuery.refetch();
					}}
					mutate={(mutate) => (
						<Button
							type="button"
							className="w-full md:ml-auto md:w-auto"
							disabled={!canSchedule}
							onClick={() => payload && mutate(payload)}
						>
							Schedule session
						</Button>
					)}
					isPending={
						<Button
							type="button"
							className="w-full md:ml-auto md:w-auto"
							disabled
						>
							Scheduling...
						</Button>
					}
					reTry={(mutate) => (
						<Button
							type="button"
							variant="outline"
							className="w-full md:ml-auto md:w-auto"
							disabled={!canSchedule}
							onClick={() => payload && mutate(payload)}
						>
							Try again
						</Button>
					)}
				/>
			</CardFooter>
		</Card>
	);
}

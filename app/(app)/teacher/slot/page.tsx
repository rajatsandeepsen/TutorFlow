"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type BookedSlot,
	useTeacherSlotBooking,
} from "@/hooks/use-slot-booking";

const withTime = (offsetDays: number, hour: number, minute: number) => {
	const value = new Date();
	value.setHours(0, 0, 0, 0);
	value.setDate(value.getDate() + offsetDays);
	value.setHours(hour, minute, 0, 0);
	return value;
};

const initialBookedSlots: BookedSlot[] = [
	{ startTime: withTime(0, 10, 0), endTime: withTime(0, 11, 0) },
	{ startTime: withTime(0, 14, 30), endTime: withTime(0, 15, 15) },
	{ startTime: withTime(1, 9, 30), endTime: withTime(1, 10, 30) },
	{ startTime: withTime(1, 16, 45), endTime: withTime(1, 17, 30) },
	{ startTime: withTime(2, 12, 0), endTime: withTime(2, 13, 30) },
];

export default function Page() {
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
	} = useTeacherSlotBooking(initialBookedSlots);
	const [activeTimePeriod, setActiveTimePeriod] = useState("morning");
	const activeTimeGroup =
		timePeriodGroups.find((group) => group.key === activeTimePeriod) ??
		timePeriodGroups[0];

	return (
		<Card className="gap-0 p-0">
			<CardHeader className="flex h-max items-center justify-start border-b px-4! py-3!">
				<CardTitle>Book your appointment</CardTitle>
			</CardHeader>
			<CardContent className="relative overflow-hidden p-0 md:min-h-[34rem] md:pr-52">
				<div className="space-y-4 p-4">
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
										className="shadow-none"
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
									className="shadow-none"
								>
									{duration}
								</Button>
							))}
						</div>
					</div>
				</div>
				<div className="inset-y-0 right-0 flex min-h-0 w-full flex-col gap-3 border-t max-md:h-60 md:absolute md:w-52 md:border-t-0 md:border-l">
					<Tabs
						value={activeTimePeriod}
						onValueChange={setActiveTimePeriod}
						className="flex h-full min-h-0 flex-col"
					>
						<TabsList className="m-4 w-auto">
							{timePeriodGroups.map((group) => (
								<TabsTrigger key={group.key} value={group.key}>
									{group.label}
								</TabsTrigger>
							))}
						</TabsList>
						<ScrollArea className="min-h-0 flex-1">
							<div className="flex flex-col gap-2 p-4 pt-3">
								{activeTimeGroup.times.map((time) => {
									const unavailable = isTimeUnavailable(time);

									return (
										<Button
											key={time}
											variant={selectedTime === time ? "default" : "outline"}
											onClick={() => setSelectedTime(time)}
											disabled={unavailable}
											className="w-full shadow-none"
										>
											{time}
										</Button>
									);
								})}
							</div>
						</ScrollArea>
					</Tabs>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col gap-4 border-t px-4 py-3! md:flex-row">
				<div className="max-w-72 text-sm">{bookingStatusMessage}</div>
				<Button
					disabled={confirmDisabled}
					className="w-full md:ml-auto md:w-auto"
					variant="outline"
				>
					Confirm
				</Button>
			</CardFooter>
		</Card>
	);
}

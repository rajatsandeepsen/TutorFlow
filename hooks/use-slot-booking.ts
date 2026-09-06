"use client";

import { useEffect } from "react";
import { create } from "zustand";
import type { USER } from "@/lib/auth";

const DURATIONS = [
	"30 mins",
	"1 hour",
	"2 hours",
	"3 hours",
	"6 hours",
] as const;
const TIME_SLOTS = Array.from({ length: 96 }, (_, i) => {
	const totalMinutes = i * 15;
	const hour = Math.floor(totalMinutes / 60);
	const minute = totalMinutes % 60;

	return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
});

const DURATION_TO_MINUTES = {
	"30 mins": 30,
	"1 hour": 60,
	"2 hours": 120,
	"3 hours": 180,
	"6 hours": 360,
};

type SlotDuration = (typeof DURATIONS)[number];

type QuickDateOption = {
	label: string;
	date: Date;
};

type TimePeriodKey = "night" | "morning" | "noon" | "evening";

type TimePeriodGroup = {
	key: TimePeriodKey;
	label: string;
	times: string[];
};

const TIME_PERIODS: {
	key: TimePeriodKey;
	label: string;
	startHour: number;
	endHour: number;
}[] = [
	{ key: "night", label: "🌙", startHour: 0, endHour: 5 },
	{ key: "morning", label: "🌄", startHour: 6, endHour: 11 },
	{ key: "noon", label: "☀️", startHour: 12, endHour: 16 },
	{ key: "evening", label: "🌃", startHour: 17, endHour: 23 },
];

export type BookedSlot = {
	user: USER;
	startTime: Date;
	endTime: Date;
};

export type BookedSlotWithoutUser = {
	startTime: Date;
	endTime: Date;
};

type SlotBookingState = {
	date: Date | undefined;
	selectedTime: string | null;
	selectedDuration: SlotDuration;
	bookedSlots: BookedSlotWithoutUser[];
	setDate: (date: Date | undefined) => void;
	setSelectedTime: (time: string | null) => void;
	setSelectedDuration: (duration: SlotDuration) => void;
	setBookedSlots: (slots: BookedSlotWithoutUser[]) => void;
};

const isSameDay = (left: Date, right: Date) =>
	left.getFullYear() === right.getFullYear() &&
	left.getMonth() === right.getMonth() &&
	left.getDate() === right.getDate();

const getNextWeekday = (fromDate: Date, weekday: number) => {
	const result = new Date(fromDate);
	const diff = (weekday - result.getDay() + 7) % 7 || 7;
	result.setDate(result.getDate() + diff);
	return result;
};

const parseTimeOnDate = (targetDate: Date, time: string) => {
	const [hourText, minuteText] = time.split(":");
	const hour = Number(hourText);
	const minute = Number(minuteText);
	const value = new Date(targetDate);
	value.setHours(hour, minute, 0, 0);
	return value;
};

const formatDisplayDate = (value: Date) =>
	value.toLocaleDateString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});

const getBookingStatusMessage = ({
	date,
	time,
	duration,
}: {
	date: Date | undefined;
	time: string | null;
	duration: string | null;
}) => {
	const parts: string[] = [];
	const missing: string[] = [];

	if (date) {
		parts.push(`for ${formatDisplayDate(date)}`);
	} else {
		missing.push("date");
	}

	if (time) {
		parts.push(`at ${time}`);
	} else {
		missing.push("time");
	}

	if (duration) {
		parts.push(`for ${duration}`);
	} else {
		missing.push("range");
	}

	const selectedSummary =
		parts.length > 0
			? `Your meeting is booked ${parts.join(", ")}`
			: "Your meeting details are not selected yet";

	if (missing.length === 0) {
		return `${selectedSummary}.`;
	}

	const missingText =
		missing.length === 1
			? `${missing[0]} is missing`
			: `${missing.slice(0, -1).join(", ")} and ${missing[missing.length - 1]} are missing`;

	return `${selectedSummary}, but ${missingText}, please select.`;
};

const useSlotBookingStore = create<SlotBookingState>((set) => ({
	date: undefined,
	selectedTime: null,
	selectedDuration: "1 hour",
	bookedSlots: [],
	setDate: (date) => set({ date }),
	setSelectedTime: (selectedTime) => set({ selectedTime }),
	setSelectedDuration: (selectedDuration) => set({ selectedDuration }),
	setBookedSlots: (bookedSlots) => set({ bookedSlots }),
}));

export const useTeacherSlotBooking = (
	initialBookedSlots: BookedSlotWithoutUser[],
) => {
	const date = useSlotBookingStore((state) => state.date);
	const selectedTime = useSlotBookingStore((state) => state.selectedTime);
	const selectedDuration = useSlotBookingStore(
		(state) => state.selectedDuration,
	);
	const bookedSlots = useSlotBookingStore((state) => state.bookedSlots);
	const setDate = useSlotBookingStore((state) => state.setDate);
	const setSelectedTime = useSlotBookingStore((state) => state.setSelectedTime);
	const setSelectedDuration = useSlotBookingStore(
		(state) => state.setSelectedDuration,
	);
	const setBookedSlots = useSlotBookingStore((state) => state.setBookedSlots);

	useEffect(() => {
		setBookedSlots(initialBookedSlots);
	}, [initialBookedSlots, setBookedSlots]);

	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	const quickDateOptions: QuickDateOption[] = [
		{ label: "Today", date: today },
		{
			label: "Tomorrow",
			date: new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + 1,
			),
		},
		{ label: "Next Saturday", date: getNextWeekday(today, 6) },
		{ label: "Next Sunday", date: getNextWeekday(today, 0) },
	];

	const isTimePassedForSelectedDate = (time: string) => {
		if (!date) return false;

		const now = new Date();
		if (!isSameDay(date, now)) return false;

		const selectedStart = parseTimeOnDate(date, time);
		return selectedStart <= now;
	};

	const isTimeBooked = (time: string) => {
		if (!date) return false;

		const selectedStart = parseTimeOnDate(date, time);
		const durationMinutes =
			DURATION_TO_MINUTES[
				selectedDuration as keyof typeof DURATION_TO_MINUTES
			] ?? 60;
		const selectedEnd = new Date(selectedStart);
		selectedEnd.setMinutes(selectedEnd.getMinutes() + durationMinutes);

		return bookedSlots.some((slot) => {
			if (!isSameDay(slot.startTime, selectedStart)) return false;
			return selectedStart < slot.endTime && selectedEnd > slot.startTime;
		});
	};

	const isTimeUnavailable = (time: string) =>
		isTimePassedForSelectedDate(time) || isTimeBooked(time);

	const isDateDisabled = (targetDate: Date) => {
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const compareDate = new Date(targetDate);
		compareDate.setHours(0, 0, 0, 0);
		return compareDate < todayStart;
	};

	useEffect(() => {
		if (selectedTime && isTimeUnavailable(selectedTime)) {
			setSelectedTime(null);
		}
	}, [date, selectedDuration, selectedTime, bookedSlots, setSelectedTime]);

	const timePeriodGroups: TimePeriodGroup[] = TIME_PERIODS.map((period) => ({
		key: period.key,
		label: period.label,
		times: TIME_SLOTS.filter((time) => {
			const hour = Number(time.split(":")[0]);
			return hour >= period.startHour && hour <= period.endHour;
		}),
	}));

	const confirmDisabled =
		!date ||
		!selectedTime ||
		(selectedTime ? isTimeUnavailable(selectedTime) : false);
	const bookingStatusMessage = getBookingStatusMessage({
		date,
		time: selectedTime,
		duration: selectedDuration,
	});

	return {
		date,
		setDate,
		selectedTime,
		setSelectedTime,
		selectedDuration,
		setSelectedDuration,
		durations: DURATIONS,
		timeSlots: TIME_SLOTS,
		timePeriodGroups,
		quickDateOptions,
		isSameDay,
		isTimeBooked,
		isTimeUnavailable,
		isDateDisabled,
		confirmDisabled,
		bookingStatusMessage,
	};
};

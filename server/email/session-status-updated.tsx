import { Preview, Section, Text } from "@react-email/components";
import { Button } from "./components";
import { EmailLayout } from "./layout";

interface EmailProps {
	studentName: string;
	topic: string;
	startTime: string;
	endTime: string;
	status:
		| "pending"
		| "confirmed"
		| "in_progress"
		| "cancelled"
		| "rejected"
		| "expired"
		| "attended";
	sessionLink?: string;
}

const statusLabel: Record<EmailProps["status"], string> = {
	pending: "Pending",
	confirmed: "Confirmed",
	in_progress: "In Progress",
	cancelled: "Cancelled",
	rejected: "Rejected",
	expired: "Expired",
	attended: "Attended",
};

const Email = ({
	studentName,
	topic,
	startTime,
	endTime,
	status,
	sessionLink,
}: EmailProps) => (
	<EmailLayout title="Session status updated">
		<Preview>Your session status was updated</Preview>

		<Text className="text-2xl">Session status updated</Text>

		<Section>
			<Text className="text-lg">Hi {studentName},</Text>
			<Text>
				Your tutor updated the session status to {statusLabel[status]}.
			</Text>
			<Text>Topic: {topic}</Text>
			<Text>Start: {startTime}</Text>
			<Text>End: {endTime}</Text>
			{sessionLink ? (
				<Button href={sessionLink} className="mt-3">
					Open Session
				</Button>
			) : null}
		</Section>
	</EmailLayout>
);

Email.PreviewProps = {
	studentName: "Student",
	topic: "Algebra",
	startTime: "2026-09-03T10:00:00.000Z",
	endTime: "2026-09-03T11:00:00.000Z",
	status: "confirmed",
	sessionLink: "https://app.example.com/auth/sign-in?email=student@example.com",
} satisfies EmailProps;

export default Email;

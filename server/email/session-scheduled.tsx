import { Preview, Section, Text } from "@react-email/components";
import { Button } from "./components";
import { EmailLayout } from "./layout";

interface EmailProps {
	studentName: string;
	tutorName: string;
	topic: string;
	startTime: string;
	endTime: string;
	joinLink: string;
}

const Email = ({
	studentName,
	tutorName,
	topic,
	startTime,
	endTime,
	joinLink,
}: EmailProps) => (
	<EmailLayout title="New session scheduled">
		<Preview>New session scheduled with your tutor</Preview>

		<Text className="text-2xl">Session scheduled</Text>

		<Section>
			<Text className="text-lg">Hi {studentName},</Text>
			<Text>{tutorName} scheduled a new session for you.</Text>
			<Text>Topic: {topic}</Text>
			<Text>Start: {startTime}</Text>
			<Text>End: {endTime}</Text>
			<Button href={joinLink} className="mt-3">
				Open Session
			</Button>
		</Section>
	</EmailLayout>
);

Email.PreviewProps = {
	studentName: "Student",
	tutorName: "Tutor",
	topic: "Algebra",
	startTime: "2026-09-03T10:00:00.000Z",
	endTime: "2026-09-03T11:00:00.000Z",
	joinLink: "https://app.example.com/auth/sign-in?email=student@example.com",
} satisfies EmailProps;

export default Email;

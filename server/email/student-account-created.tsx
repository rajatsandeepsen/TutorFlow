import { Preview, Section, Text } from "@react-email/components";
import { Button } from "./components";
import { EmailLayout } from "./layout";

interface EmailProps {
	studentName: string;
	tutorName: string;
	inviteLink: string;
}

const Email = ({ studentName, tutorName, inviteLink }: EmailProps) => (
	<EmailLayout title="You're invited to TutorFlow">
		<Preview>Your tutor invited you to TutorFlow</Preview>

		<Text className="text-2xl">You are invited</Text>

		<Section>
			<Text className="text-lg">Hi {studentName},</Text>
			<Text>{tutorName} invited you to join TutorFlow as a student.</Text>
			<Text>Use this email to sign in and complete your basic profile.</Text>
			<Button href={inviteLink} className="mt-3">
				Join TutorFlow
			</Button>
		</Section>
	</EmailLayout>
);

Email.PreviewProps = {
	studentName: "Student",
	tutorName: "Tutor",
	inviteLink: "https://app.example.com/auth/sign-in?email=student@example.com",
} satisfies EmailProps;

export default Email;

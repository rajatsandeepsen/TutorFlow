import { Preview, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

interface EmailProps {
	studentName: string;
	subject: string;
	currentLevel: string;
}

const Email = ({ studentName, subject, currentLevel }: EmailProps) => (
	<EmailLayout title="Your learning profile was updated">
		<Preview>Your tutor updated your learning profile</Preview>

		<Text className="text-2xl">Profile updated</Text>

		<Section>
			<Text className="text-lg">Hi {studentName},</Text>
			<Text>Your tutor updated your extra learning profile details.</Text>
			<Text>Subject: {subject}</Text>
			<Text>Current level: {currentLevel}</Text>
		</Section>
	</EmailLayout>
);

Email.PreviewProps = {
	studentName: "Student",
	subject: "Math",
	currentLevel: "Intermediate",
} satisfies EmailProps;

export default Email;

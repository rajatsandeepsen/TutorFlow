import { Preview, Section, Text } from "@react-email/components";
import { Button } from "./components";
import { EmailLayout } from "./layout";

interface EmailProps {
	studentName: string;
	question: string;
	homeworkLink: string;
}

const Email = ({ studentName, question, homeworkLink }: EmailProps) => (
	<EmailLayout title="New homework assigned">
		<Preview>Your tutor assigned new homework</Preview>

		<Text className="text-2xl">New homework</Text>

		<Section>
			<Text className="text-lg">Hi {studentName},</Text>
			<Text>Your tutor assigned a new homework question.</Text>
			<Text>Question: {question}</Text>
			<Button href={homeworkLink} className="mt-3">
				Open Homework
			</Button>
		</Section>
	</EmailLayout>
);

Email.PreviewProps = {
	studentName: "Student",
	question: "Solve 2x + 3 = 11",
	homeworkLink:
		"https://app.example.com/auth/sign-in?email=student@example.com",
} satisfies EmailProps;

export default Email;

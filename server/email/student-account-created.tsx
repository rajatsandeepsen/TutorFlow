import { Preview, Section, Text } from "@react-email/components";
import { getBaseURL } from "@/lib/web";
import { Button } from "./components";
import { EmailLayout } from "./layout";

interface EmailProps {
	teacherName: string;
	teacherId: string;
}

const Email = ({ teacherName, teacherId }: EmailProps) => (
	<EmailLayout title="You're invited to TutorFlow">
		<Preview>Your tutor invited you to TutorFlow</Preview>

		<Text className="text-2xl">You are invited</Text>

		<Section>
			<Text className="text-lg">Hi</Text>
			<Text>{teacherName} invited you to TutorFlow for 1:1 classes.</Text>
			<Text>
				Step 1: Create your account or sign in using your invite email.
			</Text>
			<Button href={getBaseURL()} className="mt-3">
				Login / Create account
			</Button>
			<Text className="mt-4">
				Step 2: Join {teacherName}&apos;s classroom on TutorFlow.
			</Text>
			<Button
				href={getBaseURL(`/student/join/${teacherId}`)}
				className="mt-3"
				varient="secondary"
			>
				Join this teacher
			</Button>
		</Section>
	</EmailLayout>
);

Email.PreviewProps = {
	teacherName: "Tutor",
	teacherId: "teacher_123",
} satisfies EmailProps;

export default Email;

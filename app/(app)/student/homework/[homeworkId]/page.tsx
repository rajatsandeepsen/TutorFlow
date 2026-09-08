import { redirect } from "next/navigation";

export default function Page({
	params,
}: {
	params: { homeworkId: string };
}) {
	redirect(`/student/homework`);
}

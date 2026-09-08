import { redirect } from "next/navigation";

export default function Page({
	params,
}: {
	params: { noteId: string };
}) {
	redirect(`/student/notes`);
}

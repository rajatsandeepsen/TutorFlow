import { redirect } from "next/navigation";

export default function Page({
	params,
}: {
	params: { slotId: string };
}) {
	redirect(`/teacher/session/${params.slotId}/notes`);
}

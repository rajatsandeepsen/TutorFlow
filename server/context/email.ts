import { render } from "@react-email/components";
import { env } from "env";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { triedAsync } from "@/lib/tools";

type extraProps = { jsx?: React.ReactNode; files?: File[] };

const renderEmail = (jsx?: React.ReactNode) =>
	triedAsync(render(jsx), "Inside React Email Renderer");

const transformFile = async (files?: File[]) => {
	if (!files) return;

	const attachments = [];

	for (const f of files) {
		attachments.push({
			filename: f.name,
			content: Buffer.from(await f.bytes()).toString("base64"),
			encoding: "base64",
			contentType: f.type,
		});
	}

	return attachments;
};

export const sendEmail = async (
	props: Omit<SendMailOptions, "from" | "html"> & extraProps,
) => {
	const from = `tutorflow <onboarding@resend.dev>`;

	const transporter = nodemailer.createTransport({
		secure: true,
		port: 465,
		host: "smtp.resend.com",
		auth: {
			user: "resend",
			pass: env.NODEMAILER_PASS,
		},
	});

	const attachments = await transformFile(props?.files);

	const html = await renderEmail(props.jsx);

	return await triedAsync(
		transporter.sendMail({ ...props, from, html: html.data, attachments }),
		"Inside Nodemailer",
	);
};

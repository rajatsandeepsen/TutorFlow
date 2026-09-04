import { CenterContainer } from "@/components/container";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InvitePage() {
	return (
		<CenterContainer>
			<Card>
				<CardHeader>
					<CardTitle>Invite Student</CardTitle>
					<CardDescription>
						Send an invite to add a student to the platform.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Enter student name"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Enter student email"
								required
							/>
						</div>

						<Button type="submit" className="w-full">
							Send Invite
						</Button>
					</form>
				</CardContent>
			</Card>
		</CenterContainer>
	);
}

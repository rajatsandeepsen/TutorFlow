"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { api, client } from "@/hooks/api";
import { MutationButton } from "@/hooks/mutation";

export default function Page() {
	const profileQuery = useQuery({
		queryKey: ["student", "my-profile"],
		queryFn: () => client.student.getMyProfile(),
	});

	const [name, setName] = useState("");
	const [image, setImage] = useState("");

	useEffect(() => {
		if (!profileQuery.data) return;
		setName(profileQuery.data.user.name ?? "");
		setImage(profileQuery.data.user.image ?? "");
	}, [profileQuery.data]);

	const canSaveBasic = name.trim().length > 0;

	return (
		<div className="grid gap-4 p-4">
			<Card>
				<CardHeader>
					<CardTitle>My Profile</CardTitle>
					<CardDescription>
						Manage your student account and learning profile details.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label>Email</Label>
						<Input value={profileQuery.data?.user.email ?? ""} readOnly />
					</div>
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							placeholder="Your name"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="image">Profile image URL</Label>
						<Input
							id="image"
							type="url"
							value={image}
							onChange={(event) => setImage(event.target.value)}
							placeholder="https://..."
						/>
					</div>
					<MutationButton
						api={api.student.updateMyBasicProfile.mutationOptions({
							onError: (error) => {
								toast.error(error.message);
							},
						})}
						onSuccess={async () => {
							toast.success("Profile updated");
							await profileQuery.refetch();
						}}
						mutate={(mutate) => (
							<Button
								disabled={!canSaveBasic}
								onClick={() =>
									mutate({
										name: name.trim(),
										image: image.trim() ? image.trim() : null,
									})
								}
							>
								Save basic profile
							</Button>
						)}
						isPending={<Button disabled>Saving...</Button>}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Learning Profiles</CardTitle>
					<CardDescription>
						Read-only snapshots from teachers on the platform.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{profileQuery.data?.profiles?.map((profile) => (
						<Card key={profile.id}>
							<CardContent className="space-y-2 p-4 text-sm">
								<p className="text-muted-foreground text-xs">
									Teacher ID: {profile.teacherId}
								</p>
								<p>
									<span className="font-medium">Subject:</span>{" "}
									{profile.subject}
								</p>
								<p>
									<span className="font-medium">Current level:</span>{" "}
									{profile.currentLevel}
								</p>
								<div>
									<p className="font-medium">Learning goals</p>
									<Textarea value={profile.learningGoals} readOnly />
								</div>
								<div>
									<p className="font-medium">Weak areas</p>
									<Textarea value={profile.weakAreas} readOnly />
								</div>
							</CardContent>
						</Card>
					))}
					{profileQuery.data &&
						(profileQuery.data.profiles?.length ?? 0) === 0 && (
							<p className="text-muted-foreground text-sm">
								No learning profiles yet.
							</p>
						)}
				</CardContent>
			</Card>
		</div>
	);
}

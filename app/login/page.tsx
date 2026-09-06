"use client";

import { type FormEvent, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/hooks/auth";

function SignUpFields() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (!email || !password) return;

		setIsSubmitting(true);
		await authClient.signUp.email(
			{
				name: email.split("@")[0],
				email,
				password,
			},
			{
				onSuccess: () => {
					toast.success("Sign up successful");
				},
				onError: (error) => {
					toast.error(error.error.message);
				},
			},
		);
		setIsSubmitting(false);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="sign-up-email">Email</Label>
				<Input
					id="sign-up-email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="sign-up-password">Password</Label>
				<Input
					id="sign-up-password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<Button
				type="submit"
				className="w-full"
				disabled={!email || !password || isSubmitting}
			>
				{isSubmitting ? "Submitting..." : "Sign Up"}
			</Button>
		</form>
	);
}

function SignInFields() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		e.stopPropagation();

		if (!email || !password) return;

		setIsSubmitting(true);
		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onSuccess: () => {
					toast.success("Sign in successful");
				},
				onError: (error) => {
					toast.error(error.error.message);
				},
			},
		);
		setIsSubmitting(false);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="sign-in-email">Email</Label>
				<Input
					id="sign-in-email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="sign-in-password">Password</Label>
				<Input
					id="sign-in-password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<Button
				type="submit"
				className="w-full"
				disabled={!email || !password || isSubmitting}
			>
				{isSubmitting ? "Submitting..." : "Sign In"}
			</Button>
		</form>
	);
}

export default function LoginPage() {
	return (
		<Tabs defaultValue="sign-up">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="sign-up">Sign Up</TabsTrigger>
				<TabsTrigger value="sign-in">Sign In</TabsTrigger>
			</TabsList>

			<TabsContent value="sign-up">
				<Card>
					<CardHeader>
						<CardTitle>Create Account</CardTitle>
						<CardDescription>Sign up to continue</CardDescription>
					</CardHeader>
					<CardContent>
						<SignUpFields />
					</CardContent>
				</Card>
			</TabsContent>

			<TabsContent value="sign-in">
				<Card>
					<CardHeader>
						<CardTitle>Welcome Back</CardTitle>
						<CardDescription>Sign in to continue</CardDescription>
					</CardHeader>
					<CardContent>
						<SignInFields />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}

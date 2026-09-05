import { cn } from "cn";

export const Container = ({
	children,
	containerClassName,
	className,
}: Readonly<{
	children: React.ReactNode;
	containerClassName?: string;
	className?: string;
}>) => {
	return (
		<div
			className={cn(
				"self-center justify-self-center p-3 md:py-8",
				containerClassName,
			)}
		>
			<div className={cn("min-w-sm md:min-w-md", className)}>{children}</div>
		</div>
	);
};

export const CenterContainer = ({
	children,
	containerClassName,
	className,
}: Readonly<{
	children: React.ReactNode;
	containerClassName?: string;
	className?: string;
}>) => {
	return (
		<div
			className={cn(
				"self-center justify-self-center p-3 md:py-8",
				containerClassName,
			)}
		>
			<div
				className={cn(
					"min-w-sm md:min-w-md lg:w-lg xl:w-xl 2xl:w-2xl",
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
};

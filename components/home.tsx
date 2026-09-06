import { cn } from "cn";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Image {
	src: string;
	alt: string;
	srcDark?: string;
}
interface ButtonType {
	text: string;
	url: string;
	icon?: React.ReactNode;
}
interface Buttons {
	primary?: ButtonType;
	secondary?: ButtonType;
}

export interface HeroBasicProps {
	heading: string;
	description: string;
	buttons?: Buttons;
	image: Image;
	byline?: string;
	className?: string;
	icon?: React.ReactNode;
}

export const LandingPage = ({
	icon,
	heading,
	description,
	buttons,
	image,
	byline,
	className,
}: HeroBasicProps) => {
	return (
		<section className={cn("overflow-hidden py-32", className)}>
			<div className="container mx-auto">
				<div className="flex flex-col gap-5">
					<div className="relative isolate flex flex-col gap-5">
						<div
							aria-hidden
							className="mask-[linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] pointer-events-none absolute top-1/2 left-1/2 -z-10 mx-auto size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border p-16 [-webkit-mask-image:linear-gradient(to_top,transparent,transparent,white,white,white,transparent,transparent)] md:size-[1300px] md:p-32"
						>
							<div className="size-full rounded-full border border-border p-16 md:p-32">
								<div className="size-full rounded-full border border-border" />
							</div>
						</div>
						<span className="mx-auto flex size-16 items-center justify-center rounded-full border md:size-20">
							{icon}
						</span>
						<h1 className="mx-auto max-w-xl text-pretty text-center font-semibold text-4xl tracking-tight md:text-5xl lg:max-w-3xl lg:text-6xl">
							{heading}
						</h1>
						<p className="mx-auto max-w-5xl text-balance text-center text-lg text-muted-foreground md:text-xl">
							{description}
						</p>
						<div className="flex flex-col items-center gap-3 pt-3 pb-12">
							{buttons?.primary && (
								<Button size="lg" asChild className="w-full sm:w-auto">
									<a href={buttons.primary.url}>
										{buttons.primary.text}
										<ArrowRight className="size-4" />
									</a>
								</Button>
							)}
							{byline && (
								<div className="text-center text-muted-foreground text-sm">
									{byline}
								</div>
							)}
						</div>
					</div>
					{image.srcDark ? (
						<>
							<img
								src={image.src}
								alt={image.alt}
								className="mx-auto aspect-3/4 h-full max-h-[524px] w-full max-w-5xl rounded-lg border border-border object-cover object-top-left md:aspect-video md:object-top dark:hidden"
							/>
							<img
								src={image.srcDark}
								alt={image.alt}
								className="mx-auto hidden aspect-3/4 h-full max-h-[524px] w-full max-w-5xl rounded-lg border border-border object-cover object-top-left md:aspect-video md:object-top dark:block"
							/>
						</>
					) : (
						<img
							src={image.src}
							alt={image.alt}
							className="mx-auto aspect-3/4 h-full max-h-[524px] w-full max-w-5xl rounded-lg border border-border object-cover object-top-left md:aspect-video md:object-top"
						/>
					)}
				</div>
			</div>
		</section>
	);
};

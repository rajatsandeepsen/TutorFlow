import { GraduationCapIcon } from "lucide-react";
import { type HeroBasicProps, LandingPage } from "@/components/home";

const defaultProps: HeroBasicProps = {
	heading: "TutorFlow for 1:1 Teaching",
	description:
		"Run your full tutoring workflow in one place. Manage students, sessions, notes, homework, and communication with AI-assisted planning, debriefing, and progress tracking.",
	buttons: {
		primary: {
			text: "Get Started",
			url: "/login",
		},
		secondary: {
			text: "Sign In",
			url: "/login",
		},
	},
	image: {
		src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-hero/saas-hero-1-16x9.png",
		srcDark:
			"https://deifkwefumgah.cloudfront.net/shadcnblocks/image-set/modern/saas-hero/saas-hero-1-16x9-dark.png",
		alt: "Hero Image Placeholder",
	},
	byline: "Trusted by 0,00,001 businesses worldwide",
	icon: <GraduationCapIcon className="size-6" />,
};

export default function Home() {
	return <LandingPage {...defaultProps} />;
}

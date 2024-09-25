import { H5pContent } from "./h5p-content";

interface KeywordOptions {
	points: number;
	occurrences: number;
	caseSensitive: boolean;
	forgiveMistakes: boolean;
	feedbackIncluded?: string;
	feedbackMissed?: string;
}

interface Keyword {
	keyword: string;
	options: KeywordOptions;
	alternatives?: string[];
}

interface OverallFeedback {
	from: number;
	to: number;
	feedback: string;
}

interface Behaviour {
	enableRetry: boolean;
	ignoreScoring: boolean;
	maximumLength: number;
	minimumLength: number;
	percentagePassing: number;
	percentageMastering: number;
	inputFieldSize?: string;
	pointsHost?: number;
	linebreakReplacement?: string;
}
interface Solution {
	introduction: string;
	sample: string;
}

export class H5pEssayContent extends H5pContent {
	public title: string;
	public taskDescription: string;
	public solution: Solution[];
	public keywords: Keyword[];
	public behaviour: Behaviour;
	public overallFeedback: OverallFeedback[];
}

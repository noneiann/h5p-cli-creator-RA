import { H5pContent } from "./h5p-content";

interface Media {
	type: any; // Can be further defined based on your needs
	disableImageZooming?: boolean;
}

interface HintAndFeedback {
	notChosenFeedback?: string;
	chosenFeedback?: string;
}

interface AnswerOption {
	correct: boolean;
	text: string;
	hintAndFeedback?: HintAndFeedback;
}

interface OverallFeedback {
	from: number;
	to: number;
	feedback: string;
}

interface Behaviour {
	mode?: string;
	enableSolutionsButton?: boolean;
	enableRetry?: boolean;
	oneItemAtATime?: boolean;
	showResults?: boolean;
	singlePoint?: boolean;
	randomAnswers?: boolean;
	confidenceLevels?: string;
}

export class H5pMultipleChoiceContent extends H5pContent {
	public media?: Media;
	public answerOptions: AnswerOption[] = [];
	public overallFeedback: OverallFeedback[] = [];
	public behaviour?: Behaviour;
	public question: string;
}

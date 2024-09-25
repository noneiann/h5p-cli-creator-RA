import { H5pContent } from "./h5p-content";

export interface OverallFeedback {
	from: number;
	to: number;
	feedback: string;
}

export interface Behaviour {
	enableRetry: boolean;
	enableSolutionsButton: boolean;
	infiniteChecking: boolean;
	showAllBlanks: boolean;
	colorBackground: string;
}

export class H5pPickTheSymbols extends H5pContent {
	public taskDescription: string;
	public text: string;
	public symbols: string;
	public overallFeedback: OverallFeedback[] = [];
	public behaviour: Behaviour;
}

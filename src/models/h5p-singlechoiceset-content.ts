import { H5pContent } from "./h5p-content";

export class H5pSingleChoiceSet extends H5pContent {
	public choices: {
		subContentId: string;
		question: string;
		answers: string[];
	}[];

	public behaviour: {
		timeoutCorrect: number; // Time to show correct answer feedback
		timeoutWrong: number; // Time to show wrong answer feedback
		soundEffectsEnabled: boolean; // Whether sound effects are enabled
		enableRetry: boolean; // Whether retries are allowed
		enableSolutionsButton: boolean; // Whether the "Show Solution" button is enabled
		passPercentage: number; // The passing score percentage (e.g., 100%)
	};
}

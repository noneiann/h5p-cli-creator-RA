import { H5pContent } from "./h5p-content";

export class H5pMarkTheWordsContent extends H5pContent {
	public taskDescription: string;
	public textField: string;
	public overallFeedback: [
		{
			from: number;
			to: number;
			feedback: string; //"Score: @score of @total.";
		}
	];
	public behaviour: {
		enableRetry: boolean;
		enableSolutionsButton: boolean;
		instantFeedback: boolean;
		enableCheckButton: boolean;
	};
}

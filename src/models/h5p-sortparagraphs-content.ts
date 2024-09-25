import { H5pContent } from "./h5p-content";

export class H5pSortParagraphsContent extends H5pContent {
	public taskDescription: string;
	public paragraphs: string[];
	public overallFeedback: {
		from: number;
		to: number;
	}[];
	public behaviour: {
		scoringMode: string;
		applyPenalties: boolean;
		duplicatesInterchangeable: boolean;
		enableRetry: boolean;
		enableSolutionsButton: boolean;
		addButtonsForMovement: boolean;
	};
}

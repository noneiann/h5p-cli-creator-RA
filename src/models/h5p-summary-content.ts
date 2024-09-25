import { H5pContent } from "./h5p-content";

export class H5pSummaryContent extends H5pContent {
	public intro: string;
	public summaries: {
		subContentId: string;
		summary: string[];
		tip: string;
	}[];

	public overallFeedback: {
		from: number;
		to: number;
		feedback: string;
	}[];
}

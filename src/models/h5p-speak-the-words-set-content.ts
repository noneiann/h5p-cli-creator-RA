import { H5pContent } from "./h5p-content";

interface Introduction {
	showIntroPage: boolean;
	introductionImage?: {
		path: string;
		mime: string;
		width: number;
		height: number;
		copyright?: any;
	};
	introductionTitle?: string;
	introductionText?: string;
}

interface Question {
	library: string;
	params: any;
	metadata: any;
}

interface OverallFeedback {
	from: number;
	to: number;
	feedback: string;
}

export class H5pSpeakTheWordsSetContent extends H5pContent {
	public introduction: Introduction = { showIntroPage: false };
	public questions: Question[] = [];
	public overallFeedback: OverallFeedback[] = [];
}

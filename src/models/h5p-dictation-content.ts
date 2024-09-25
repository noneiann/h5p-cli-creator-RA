import { H5pAudio } from "./h5p-audio";
import { H5pContent } from "./h5p-content";

export class H5pDictationContent extends H5pContent {
	public taskDescription: string;
	public sentences: {
		sample?: H5pAudio[]; // Changed to an array of H5pAudio objects
		sampleAlternative?: H5pAudio[]; // Changed to an array of H5pAudio objects
		text: string;
	}[];
	public overallFeedback: {
		from: number;
		to: number;
		feedback: string;
	}[];
	public behaviour: {
		enableRetry: boolean;
		tries: number;
		scoring: {
			ignorePunctuation: boolean;
			zeroMistakeMode: boolean;
			typoFactor: number;
		};
		textual: {
			wordSeparator: string;
			overrideRTL: string;
			autosplit: boolean;
		};
		feedbackPresentation: {
			customTypoDisplay: boolean;
			alternateSolution: string;
		};
		enableSolutionsButton: boolean;
	};
}

import { H5pContent } from "./h5p-content";
import { H5pImage } from "./h5p-image";

interface Word {
	clue: string;
	answer: string;
	orientation?: string;
	fixWord?: boolean;
}

interface FeedbackRange {
	from: number;
	to: number;
	feedback: string;
}

interface Behaviour {
	enableInstantFeedback: boolean;
	enableRetry: boolean;
	enableSolutionsButton: boolean;
	scoreWords: boolean;
	applyPenalties: boolean;
	keepCorrectAnswers: boolean;
}

interface Theme {
	backgroundColor: string;
	gridColor: string;
	cellBackgroundColor: string;
	cellColor: string;
	clueIdColor: string;
	cellBackgroundColorHighlight: string;
	cellColorHighlight: string;
	clueIdColorHighlight: string;
	backgroundImage?: H5pImage;
}

export class H5pCrosswordContent extends H5pContent {
	public title: string;
	public taskDescription: string;
	public words: Word[];
	public overallFeedback: FeedbackRange[];
	public behaviour: Behaviour;
	public l10n: any;
	public a11y: any;
	public theme?: Theme;
}

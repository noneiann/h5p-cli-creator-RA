// models/h5p-fill-in-the-blanks-content.ts
import { H5pContent } from "./h5p-content";

export class H5pFillInTheBlanksContent extends H5pContent {
	public text: string;
	public behaviour: {
		enableRetry?: boolean;
		enableSolutionsButton?: boolean;
		autoCheck?: boolean;
		caseSensitive?: boolean;
		showSolutionsRequiresInput?: boolean;
		separateLines?: boolean;
		confirmCheckDialog?: boolean;
		confirmRetryDialog?: boolean;
		enableCheckButton?: boolean;
		acceptSpellingErrors?: boolean;
	};
	public questions: string[];
}

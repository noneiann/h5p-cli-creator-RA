// models/h5p-question-set-content.ts

import { H5pContent } from "./h5p-content";

export class H5pQuestionSetContent extends H5pContent {
	public title: string;
	public introPage: {
		showIntroPage: boolean;
		introduction: string;
		startButtonText: string;
	};
	public progressType: string;
	public passPercentage: number;
	public questions: any[] = [];
	public disableBackwardsNavigation: boolean;
	public randomQuestions: boolean;
	public endGame: any;
	public override: any;
	public texts: any;
}

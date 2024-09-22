import * as path from "path";
import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pFillInTheBlanksContent } from "./models/h5p-fill-in-the-blanks-content";

export class FillInTheBlanksCreator extends ContentCreator<H5pFillInTheBlanksContent> {
	constructor(
		h5pPackage: H5pPackage,
		private questions: Array<string>,  // Assuming questions is an array of strings
		private title: string,
		private description: string,
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
	}

	protected contentObjectFactory(): H5pFillInTheBlanksContent {
		return new H5pFillInTheBlanksContent();
	}

	protected async addContent(
		contentObject: H5pFillInTheBlanksContent
	): Promise<void> {
		const formattedQuestions = [];
		for (const question of this.questions) {
			formattedQuestions.push(`<p>${question}</p>\n`);
		}
		const text = `<p>${this.description}</p>\n`;
		contentObject.questions = formattedQuestions;
		contentObject.text = text;
	}

	protected addSettings(contentObject: H5pFillInTheBlanksContent) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);

		// Behaviour settings
		contentObject.behaviour = {
			enableRetry: false,
			enableSolutionsButton: true,
			autoCheck: false,
			caseSensitive: true,
			showSolutionsRequiresInput: false,
			separateLines: false,
			confirmCheckDialog: false,
			confirmRetryDialog: false,
			acceptSpellingErrors: false,
		};
	}
}

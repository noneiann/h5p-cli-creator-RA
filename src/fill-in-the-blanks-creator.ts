import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pFillInTheBlanksContent } from "./models/h5p-fill-in-the-blanks-content";

export class FillInTheBlanksCreator extends ContentCreator<H5pFillInTheBlanksContent> {
	constructor(
		h5pPackage: H5pPackage,
		private data: Array<{ questions: string }>,
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
		const questions = [];
		for (const line of this.data) {
			questions.push(`<p>${line.questions}</p> \n\n `);
		}
		contentObject.questions = questions;
	}

	protected addSettings(contentObject: H5pFillInTheBlanksContent) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);

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

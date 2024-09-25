import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pMarkTheWordsContent } from "./models/h5p-markthewords-content";

export class MarkTheWordsCreator extends ContentCreator<H5pMarkTheWordsContent> {
	constructor(
		h5pPackage: H5pPackage,
		private title: string,
		private taskDescription: string,
		private textField: string,
		private overallFeedback: [
			{
				from: number;
				to: number;
				feedback: string;
			}
		],
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
	}

	protected contentObjectFactory(): H5pMarkTheWordsContent {
		return new H5pMarkTheWordsContent();
	}

	protected async addContent(
		contentObject: H5pMarkTheWordsContent
	): Promise<void> {
		contentObject.taskDescription = this.taskDescription;
		contentObject.textField = this.textField;
		contentObject.overallFeedback = this.overallFeedback;
	}

	public setTitle(title: string) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}

	protected addSettings(contentObject: H5pMarkTheWordsContent) {
		contentObject.behaviour = {
			enableRetry: false,
			enableSolutionsButton: true,
			instantFeedback: true,
			enableCheckButton: true,
		};
	}
}

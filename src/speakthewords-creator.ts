import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pSpeakTheWords } from "./models/h5p-speakthewords";

export class SpeakTheWordsCreator extends ContentCreator<H5pSpeakTheWords> {
	constructor(
		h5pPackage: H5pPackage,
		private title: string,
		private question: string,
		private acceptedAnswers: string[],
		private inputLanguage: string,
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
	}

	protected contentObjectFactory(): H5pSpeakTheWords {
		return new H5pSpeakTheWords();
	}

	protected async addContent(contentObject: H5pSpeakTheWords): Promise<void> {
		contentObject.question = this.question;
		contentObject.acceptedAnswers = this.acceptedAnswers;
		contentObject.inputLanguage = this.inputLanguage;
	}

	protected addSettings(contentObject: H5pSpeakTheWords) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}
}

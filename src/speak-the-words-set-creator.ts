import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pSpeakTheWordsSetContent } from "./models/h5p-speak-the-words-set-content";
import { H5pImage } from "./models/h5p-image";

export class SpeakTheWordsSetCreator extends ContentCreator<H5pSpeakTheWordsSetContent> {
	constructor(
		h5pPackage: H5pPackage,
		private introduction: any,
		private questionsData: Array<any>,
		private overallFeedback: Array<any>,
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
	}

	protected contentObjectFactory(): H5pSpeakTheWordsSetContent {
		return new H5pSpeakTheWordsSetContent();
	}

	protected async addContent(
		contentObject: H5pSpeakTheWordsSetContent
	): Promise<void> {
		// Set introduction
		if (this.introduction) {
			contentObject.introduction = {
				showIntroPage: this.introduction.showIntroPage || false,
				introductionTitle: this.introduction.introductionTitle || "",
				introductionText: this.introduction.introductionText || "",
			};

			if (this.introduction.introductionImage) {
				// Handle the introduction image using H5pImage
				const introImagePath = path.join(
					this.sourcePath,
					this.introduction.introductionImage.path
				);

				try {
					const { image, buffer } = await H5pImage.fromLocalFile(
						introImagePath
					);
					const filename = `images/${path.basename(introImagePath)}`;

					// Add the image to the H5P package
					this.h5pPackage.addContentFile(filename, buffer);

					// Update the introduction image path
					contentObject.introduction.introductionImage = {
						path: filename,
						mime: image.mime,
						width: image.width,
						height: image.height,
						copyright: image.copyright || {},
					};
				} catch (error) {
					console.error(
						`Error processing introduction image: ${error.message}`
					);
				}
			}
		}

		// Initialize the questions array
		contentObject.questions = [];

		for (const questionData of this.questionsData) {
			// Generate params for each question
			const params = {
				question: questionData.question,
				acceptedAnswers: questionData.acceptedAnswers,
				inputLanguage: questionData.inputLanguage || "en-US",
			};

			// Create the question object
			const question = {
				library: "H5P.SpeakTheWords 1.5",
				params: params,
				metadata: {
					title: questionData.title || "Untitled Question",
					license: "U",
				},
			};

			// Add the question to the questions array
			contentObject.questions.push(question);
		}

		// Set overall feedback
		contentObject.overallFeedback = this.overallFeedback || [];
	}

	protected addSettings(contentObject: H5pSpeakTheWordsSetContent) {
		// Set the title
		this.h5pPackage.h5pMetadata.title =
			this.introduction.introductionTitle || "Untitled Speak the Words Set";
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}
}

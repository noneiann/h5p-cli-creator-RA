import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pSingleChoiceSet } from "./models/h5p-singlechoiceset-content";
export class SingleChoiceSetCreator extends ContentCreator<H5pSingleChoiceSet> {
	constructor(
		h5pPackage: H5pPackage,
		private title: string,
		private choices: Array<{
			question: string;
			answers: string[];
			correctAnswer: number;
		}>,
		private behaviour: {
			timeoutCorrect: number;
			timeoutWrong: number;
			soundEffectsEnabled: boolean;
			enableRetry: boolean;
			enableSolutionsButton: boolean;
			passPercentage: number;
		}
	) {
		super(h5pPackage, ""); // Passing empty sourcePath
		this.behaviour = {
			timeoutCorrect: 2000,
			timeoutWrong: 3000,
			soundEffectsEnabled: true,
			enableRetry: false,
			enableSolutionsButton: true,
			passPercentage: 70,
		};
	}

	protected contentObjectFactory(): H5pSingleChoiceSet {
		return new H5pSingleChoiceSet();
	}

	protected async addContent(contentObject: H5pSingleChoiceSet): Promise<void> {
		contentObject.choices = new Array();

		// Add the questions and answers to the content
		for (const choice of this.choices) {
			contentObject.choices.push({
				subContentId: this.generateUUID(), // Generate a unique ID for each question
				question: choice.question,
				answers: choice.answers,
			});
		}

		// Assign the behaviour settings to the content object
		contentObject.behaviour = this.behaviour;
	}

	// A helper method to generate UUID for each question
	private generateUUID(): string {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
			/[xy]/g,
			function (c) {
				const r = (Math.random() * 16) | 0,
					v = c == "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			}
		);
	}

	protected addSettings(contentObject: H5pSingleChoiceSet) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}
}

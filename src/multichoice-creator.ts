import * as path from "path";
import * as fs from "fs-extra";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pImage } from "./models/h5p-image";
import { H5pMultipleChoiceContent } from "./models/h5p-multichoice-content";

export class MultipleChoiceCreator extends ContentCreator<H5pMultipleChoiceContent> {
	constructor(
		h5pPackage: H5pPackage,
		private contentData: any,
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
	}

	protected contentObjectFactory(): H5pMultipleChoiceContent {
		return new H5pMultipleChoiceContent();
	}

	protected async addContent(
		contentObject: H5pMultipleChoiceContent
	): Promise<void> {
		// Set the question text
		contentObject.question = this.contentData.question;

		// Process the answer options
		contentObject.answerOptions = this.contentData.answerOptions.map(
			(option: any) => {
				return {
					correct: option.correct,
					text: option.text,
					hintAndFeedback: {
						chosenFeedback: option.chosenFeedback || "",
						notChosenFeedback: option.notChosenFeedback || "",
					},
				};
			}
		);

		// Set the overall feedback
		contentObject.overallFeedback = this.contentData.overallFeedback || [];

		// Set default behaviour
		contentObject.behaviour = {
			mode: "allOptions",
			enableSolutionsButton: true,
			enableRetry: false,
			oneItemAtATime: false,
			showResults: true,
			randomAnswers: true,
			singlePoint: false,
			confidenceLevels: "100,50,0",
		};

		// Handle the image if provided
		if (this.contentData.imagePath) {
			const mediaFilePath = path.join(
				this.sourcePath,
				this.contentData.imagePath
			);

			try {
				const { image, buffer } = await H5pImage.fromLocalFile(mediaFilePath);
				const filename = `images/${path.basename(mediaFilePath)}`;

				this.h5pPackage.addContentFile(filename, buffer);

				// Set the media property in the content object
				contentObject.media = {
					type: {
						library: "H5P.Image 1.1",
						params: {
							decorative: true,
							file: {
								path: filename,
								mime: image.mime,
								width: image.width,
								height: image.height,
								copyright: image.copyright || {},
							},
						},
						metadata: {
							title: "Question Image",
							license: "U",
						},
					},
					disableImageZooming: true,
				};
			} catch (error) {
				console.error(`Error processing image: ${error.message}`);
				// Remove media if there's an error
				delete contentObject.media;
			}
		} else {
			// If no image is provided, ensure media is undefined
			delete contentObject.media;
		}
	}

	protected addSettings(contentObject: H5pMultipleChoiceContent) {
		console.log("title", this.contentData);
		// Set the title from contentData.title or default to "Untitled Multiple Choice"
		this.h5pPackage.h5pMetadata.title =
			this.contentData.title || "Untitled Multiple Choice";
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}
}

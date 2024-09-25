import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pSortParagraphsContent } from "./models/h5p-sortparagraphs-content";

export class SortParagraphsCreator extends ContentCreator<H5pSortParagraphsContent> {
	constructor(
		h5pPackage: H5pPackage,
		private title: string,
		private taskDescription: string,
		private paragraphs: string[], // Array of paragraphs
		private overallFeedback: Array<{
			from: number;
			to: number;
		}>,
		private behaviour: {
			scoringMode: string;
			applyPenalties: boolean;
			duplicatesInterchangeable: boolean;
			enableRetry: boolean;
			enableSolutionsButton: boolean;
			addButtonsForMovement: boolean;
		}
	) {
		super(h5pPackage, ""); // Passing empty sourcePath

		// Default behavior settings, these can be overridden by the constructor arguments
		this.behaviour = {
			scoringMode: "transitions",
			applyPenalties: true,
			duplicatesInterchangeable: true,
			enableRetry: false,
			enableSolutionsButton: true,
			addButtonsForMovement: true,
		};
	}

	protected contentObjectFactory(): H5pSortParagraphsContent {
		return new H5pSortParagraphsContent();
	}

	protected async addContent(
		contentObject: H5pSortParagraphsContent
	): Promise<void> {
		// Assign taskDescription and paragraphs
		contentObject.taskDescription = this.taskDescription;
		contentObject.paragraphs = [...this.paragraphs];

		// Assign the overall feedback settings
		contentObject.overallFeedback = [...this.overallFeedback];

		// Assign the behaviour settings to the content object
		contentObject.behaviour = this.behaviour;
	}

	// A helper method to generate UUID (not needed in this specific use case but can be kept if needed)
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

	protected addSettings(contentObject: H5pSortParagraphsContent) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}
}

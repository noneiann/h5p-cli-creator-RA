import * as path from "path";
import * as fs from "fs-extra";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pEssayContent } from "./models/h5p-essay-content";

export class EssayCreator extends ContentCreator<H5pEssayContent> {
	constructor(
		h5pPackage: H5pPackage,
		private contentData: any,
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
	}

	protected contentObjectFactory(): H5pEssayContent {
		return new H5pEssayContent();
	}

	protected async addContent(contentObject: H5pEssayContent): Promise<void> {
		// Set the title
		contentObject.title = this.contentData.title || "Untitled Essay";

		// Set the task description
		contentObject.taskDescription = this.contentData.taskDescription || "";

		// Set the keywords
		contentObject.keywords = this.contentData.keywords || [];

		// Set the behaviour settings
		contentObject.solution = this.contentData.solution || [];
		// Set the overall feedback
		contentObject.overallFeedback = this.contentData.overallFeedback || [];
	}

	protected addSettings(contentObject: H5pEssayContent) {
		// Set the title in the H5P package metadata
		this.h5pPackage.h5pMetadata.title = contentObject.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
		contentObject.behaviour = {
			enableRetry: this.contentData.behaviour?.enableRetry ?? true,
			ignoreScoring: this.contentData.behaviour?.ignoreScoring ?? false,
			maximumLength: this.contentData.behaviour?.maximumLength ?? 500,
			minimumLength: this.contentData.behaviour?.minimumLength ?? 100,
			percentagePassing: this.contentData.behaviour?.percentagePassing ?? 50,
			percentageMastering:
				this.contentData.behaviour?.percentageMastering ?? 80,
			inputFieldSize: "small", // Default value
			pointsHost: 1, // Default value
			linebreakReplacement: " ", // Default value
		};
	}
}

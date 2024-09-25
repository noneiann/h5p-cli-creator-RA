import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pSummaryContent } from "./models/h5p-summary-content";

export class SummaryCreator extends ContentCreator<H5pSummaryContent> {
	constructor(
		h5pPackage: H5pPackage,
		private title: string,
		private intro: string,
		private summaries: Array<{
			summary: string[];
			tip: string;
			subContentId: string;
		}>,
		private overallFeedback: Array<{
			from: number;
			to: number;
			feedback: string;
		}>
	) {
		super(h5pPackage, ""); // Passing empty sourcePath
	}

	protected contentObjectFactory(): H5pSummaryContent {
		return new H5pSummaryContent();
	}

	protected async addContent(contentObject: H5pSummaryContent): Promise<void> {
		contentObject.intro = this.intro;

		contentObject.summaries = new Array();
		for (const summary of this.summaries) {
			contentObject.summaries.push({
				subContentId: this.generateUUID(),
				summary: summary.summary,
				tip: summary.tip,
			});
		}

		contentObject.overallFeedback = this.overallFeedback;
	}

	// A helper method to generate UUIDs for each question
	private generateUUID(): string {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
			/[xy]/g,
			function (c) {
				const r = (Math.random() * 16) | 0,
					v = c === "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			}
		);
	}

	protected addSettings(contentObject: H5pSummaryContent) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}
}

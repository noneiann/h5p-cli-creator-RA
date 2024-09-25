import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pAudio } from "./models/h5p-audio";
import { H5pDictationContent } from "./models/h5p-dictation-content";

export class DictationCreator extends ContentCreator<H5pDictationContent> {
	private audioCounter = 0;

	constructor(
		h5pPackage: H5pPackage,
		private title: string,
		private taskDescription: string,
		private sentences: Array<{
			sample?: string;
			sampleAlternative?: string;
			text: string;
		}>,
		private overallFeedback: Array<{
			from: number;
			to: number;
			feedback: string;
		}>,
		private behaviour: {
			enableRetry: boolean;
			tries: number;
			scoring: {
				ignorePunctuation: boolean;
				zeroMistakeMode: boolean;
				typoFactor: number;
			};
			textual: {
				wordSeparator: string;
				overrideRTL: string;
				autosplit: boolean;
			};
			feedbackPresentation: {
				customTypoDisplay: boolean;
				alternateSolution: string;
			};
			enableSolutionsButton: boolean;
		},

		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
		this.behaviour = {
			enableRetry: false,
			tries: 0,
			scoring: {
				ignorePunctuation: true,
				zeroMistakeMode: false,
				typoFactor: 0.1,
			},
			textual: {
				wordSeparator: " ",
				overrideRTL: "auto",
				autosplit: true,
			},
			feedbackPresentation: {
				customTypoDisplay: true,
				alternateSolution: "You might also consider this solution.",
			},
			enableSolutionsButton: true,
		};
	}

	protected contentObjectFactory(): H5pDictationContent {
		return new H5pDictationContent();
	}

	protected async addContent(
		contentObject: H5pDictationContent
	): Promise<void> {
		contentObject.sentences = new Array();
		contentObject.overallFeedback = new Array();

		for (const sentence of this.sentences) {
			const sample = await this.processAudio(sentence.sample);
			const sampleAlternative = await this.processAudio(
				sentence.sampleAlternative
			);

			contentObject.sentences.push({
				sample: sample ? [sample] : undefined,
				sampleAlternative: sampleAlternative ? [sampleAlternative] : undefined,
				text: sentence.text,
			});
		}
		for (const feedback of this.overallFeedback) {
			contentObject.overallFeedback.push({
				from: feedback.from,
				to: feedback.to,
				feedback: feedback.feedback,
			});
		}
		contentObject.behaviour = this.behaviour;
	}

	private async processAudio(
		audioPath?: string
	): Promise<H5pAudio | undefined> {
		if (!audioPath) {
			return undefined;
		}

		try {
			let ret: { extension: string; buffer: Buffer; audio: H5pAudio };
			if (
				!audioPath.startsWith("http://") &&
				!audioPath.startsWith("https://")
			) {
				// Load audio from a local file
				ret = await H5pAudio.fromLocalFile(
					path.join(this.sourcePath, audioPath)
				);
			} else {
				// Download audio from URL
				ret = await H5pAudio.fromDownload(audioPath);
			}

			const filename = this.getFilenameForAudio(
				this.audioCounter++,
				ret.extension
			);
			this.h5pPackage.addContentFile(filename, ret.buffer);
			ret.audio.path = filename;

			console.log(
				`Downloaded audio from ${audioPath}. (${ret.buffer.byteLength} bytes)`
			);

			return ret.audio;
		} catch (exc) {
			console.error(`Error processing audio ${audioPath}:`, exc);
			return undefined;
		}
	}

	private getFilenameForAudio(counter: number, extension: string) {
		return `audios/${counter}${extension}`;
	}

	protected addSettings(contentObject: H5pDictationContent) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);

		contentObject.taskDescription = this.taskDescription;
		contentObject.behaviour = this.behaviour;
	}
}

import * as path from "path";
import * as fs from "fs-extra";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pCrosswordContent } from "./models/h5p-crossword-content";
import { H5pImage } from "./models/h5p-image";

export class CrosswordCreator extends ContentCreator<H5pCrosswordContent> {
	constructor(
		h5pPackage: H5pPackage,
		private contentData: any,
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
	}

	protected contentObjectFactory(): H5pCrosswordContent {
		return new H5pCrosswordContent();
	}

	protected async addContent(
		contentObject: H5pCrosswordContent
	): Promise<void> {
		// Set the title
		contentObject.title = this.contentData.title || "Untitled Crossword";

		// Set the task description
		contentObject.taskDescription = this.contentData.taskDescription || "";

		// Set the words
		contentObject.words = this.contentData.words.map((wordData: any) => {
			return {
				clue: wordData.clue,
				answer: wordData.answer.toUpperCase(), // Answers should be uppercase
				orientation: "across", // Default orientation
				fixWord: false, // Default value
			};
		});

		// Set the overall feedback
		contentObject.overallFeedback = this.contentData.overallFeedback || [];

		// Set default behaviour settings
		contentObject.behaviour = {
			enableInstantFeedback: false,
			enableRetry: true,
			enableSolutionsButton: true,
			scoreWords: false,
			applyPenalties: true,
			keepCorrectAnswers: false,
		};

		// Set default localization strings
		contentObject.l10n = {
			across: "Across",
			down: "Down",
			checkAnswer: "Check",
			tryAgain: "Retry",
			showSolution: "Show solution",
			couldNotGenerateCrossword:
				"Could not generate a crossword with the given words. Please try again.",
			extraClue: "Extra clue",
			closeWindow: "Close window",
			submitAnswer: "Submit",
			couldNotGenerateCrosswordTooFewWords:
				"Could not generate a crossword. You need at least two words.",
			problematicWords: "Problematic word(s): @words",
		};

		// Set default accessibility strings
		contentObject.a11y = {
			crosswordGrid:
				"Crossword grid. Use arrow keys to navigate and keyboard to enter characters. Use tab to use input fields instead.",
			column: "Column",
			row: "Row",
			across: "Across",
			down: "Down",
			empty: "Empty",
			resultFor: "Result for: @clue",
			correct: "Correct",
			wrong: "Wrong",
			point: "point",
			solutionFor: "For @clue the solution is: @solution",
			extraClueFor: "Open extra clue for @clue",
			letterSevenOfNine: "Letter @position of @length",
			lettersWord: "@length letter word",
			check:
				"Check the characters. The responses will be marked as correct, incorrect, or unanswered.",
			showSolution:
				"Show the solution. The crossword will be filled with its correct solution.",
			retry:
				"Retry the task. Reset all responses and start the task over again.",
			yourResult: "You got @score out of @total points.",
		};

		// Process theme if imagePath is provided
		if (this.contentData.theme && this.contentData.theme.imagePath) {
			const themeImagePath = path.join(
				this.sourcePath,
				this.contentData.theme.imagePath
			);

			try {
				const { image, buffer } = await H5pImage.fromLocalFile(themeImagePath);
				const filename = `images/${path.basename(themeImagePath)}`;

				this.h5pPackage.addContentFile(filename, buffer);

				// Set the theme with the background image and default values
				contentObject.theme = {
					backgroundImage: {
						path: filename,
						mime: image.mime,
						width: image.width,
						height: image.height,
						copyright: image.copyright,
					},
					// Default theme colors
					backgroundColor: "#000000",
					gridColor: "#000000",
					cellBackgroundColor: "#ffffff",
					cellColor: "#000000",
					clueIdColor: "#606060",
					cellBackgroundColorHighlight: "#3e8de8",
					cellColorHighlight: "#ffffff",
					clueIdColorHighlight: "#e0e0e0",
				};
			} catch (error) {
				console.error(`Error processing theme image: ${error.message}`);
				// If there's an error, do not set the theme
				delete contentObject.theme;
			}
		} else {
			// No theme image provided; set default theme without background image
			contentObject.theme = {
				// Default theme colors
				backgroundColor: "#000000",
				gridColor: "#000000",
				cellBackgroundColor: "#ffffff",
				cellColor: "#000000",
				clueIdColor: "#606060",
				cellBackgroundColorHighlight: "#3e8de8",
				cellColorHighlight: "#ffffff",
				clueIdColorHighlight: "#e0e0e0",
			};
		}
	}

	protected addSettings(contentObject: H5pCrosswordContent) {
		// Set the title in the H5P package metadata
		this.h5pPackage.h5pMetadata.title = contentObject.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}
}

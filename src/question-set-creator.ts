// question-set-creator.ts

import * as path from "path";
import * as fs from "fs-extra";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pQuestionSetContent } from "./models/h5p-question-set-content";
import { H5pImage } from "./models/h5p-image";

export class QuestionSetCreator extends ContentCreator<H5pQuestionSetContent> {
	constructor(
		h5pPackage: H5pPackage,
		private contentData: any,
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
	}

	protected contentObjectFactory(): H5pQuestionSetContent {
		return new H5pQuestionSetContent();
	}

	protected async addContent(
		contentObject: H5pQuestionSetContent
	): Promise<void> {
		// Set title
		contentObject.title = this.contentData.title || "Untitled Question Set";

		// Set intro page (no cover image in simplified input)
		contentObject.introPage = {
			showIntroPage: false,
			introduction: "",
			startButtonText: "Start Quiz",
		};

		// Set default settings
		contentObject.progressType = "dots";
		contentObject.passPercentage = 50;
		contentObject.disableBackwardsNavigation = false;
		contentObject.randomQuestions = false;
		contentObject.override = { checkButton: true };
		contentObject.endGame = {
			showResultPage: true,
			showSolutionButton: true,
			showRetryButton: true,
			noResultMessage: "Finished",
			message: "Your result:",
			scoreBarLabel: "You got @finals out of @totals points",
			overallFeedback: [{ from: 0, to: 100 }],
			solutionButtonText: "Show solution",
			retryButtonText: "Retry",
			finishButtonText: "Finish",
			submitButtonText: "Submit",
			showAnimations: false,
			skippable: false,
			skipButtonText: "Skip video",
		};
		contentObject.texts = {
			prevButton: "Previous question",
			nextButton: "Next question",
			finishButton: "Finish",
			submitButton: "Submit",
			textualProgress: "Question: @current of @total questions",
			jumpToQuestion: "Question %d of %total",
			questionLabel: "Question",
			readSpeakerProgress: "Question @current of @total",
			unansweredText: "Unanswered",
			answeredText: "Answered",
			currentQuestionText: "Current question",
			navigationLabel: "Questions",
		};

		// Process questions
		contentObject.questions = [];

		for (const questionData of this.contentData.questions) {
			const question: any = {
				library: "H5P.TrueFalse 1.8",
				params: {
					question: questionData.question,
					correct: questionData.correct ? "true" : "false",
					behaviour: {
						enableRetry: false,
						enableSolutionsButton: false,
						enableCheckButton: true,
						confirmCheckDialog: false,
						confirmRetryDialog: false,
						autoCheck: true,
						feedbackOnCorrect: "Correct!",
						feedbackOnWrong: "Wrong answer :(",
					},
					l10n: {
						trueText: "Option A",
						falseText: "Option B",
						checkAnswer: "Check",
						submitAnswer: "Submit",
						showSolutionButton: "Show solution",
						tryAgain: "Retry",
						wrongAnswerMessage: "Wrong answer",
						correctAnswerMessage: "Correct answer",
					},
				},
				metadata: {
					title: "Two-Choice Question",
					license: "U",
					contentType: "True/False Question",
				},
			};

			// Handle question image if provided
			if (questionData.imagePath) {
				const questionImagePath = path.join(
					this.sourcePath,
					questionData.imagePath
				);

				try {
					const { image, buffer } = await H5pImage.fromLocalFile(
						questionImagePath
					);
					const filename = `images/${path.basename(questionImagePath)}`;

					this.h5pPackage.addContentFile(filename, buffer);

					question.params.media = {
						type: {
							library: "H5P.Image 1.1",
							params: {
								file: {
									path: filename,
									mime: image.mime,
									width: image.width,
									height: image.height,
									copyright: image.copyright || {},
								},
								alt: questionData.altText || "",
							},
							metadata: {
								title: "Question Image",
								license: "U",
							},
						},
						disableImageZooming: true,
					};
				} catch (error) {
					console.error(`Error processing question image: ${error.message}`);
				}
			}

			contentObject.questions.push(question);
		}
	}

	protected addSettings(contentObject: H5pQuestionSetContent) {
		// Set the title in the H5P package metadata
		this.h5pPackage.h5pMetadata.title = contentObject.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
	}
}

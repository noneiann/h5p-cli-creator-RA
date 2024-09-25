// multiple-choice-module.ts

import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";

import { MultipleChoiceCreator } from "./multichoice-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for Multiple Choice.
 */
export class MultipleChoiceModule implements yargs.CommandModule {
	public command = "multiplechoice <input> <output>";
	public describe =
		"Converts JSON input to H5P Multiple Choice content. The JSON should include media, answerOptions, overallFeedback, behaviour, and question.";
	public builder = (y: yargs.Argv) =>
		y
			.positional("input", { describe: "JSON input file" })
			.positional("output", {
				describe: "H5P output file including .h5p extension",
			})
			.option("l", {
				alias: "language",
				describe: "Language for translations in H5P content",
				default: "en",
				type: "string",
			})
			.option("e", {
				alias: "encoding",
				describe: "Encoding",
				default: "utf8",
				type: "string",
			});

	public handler = async (argv) => {
		await this.runMultipleChoice(argv.input, argv.output, argv.e, argv.l);
	};

	private async runMultipleChoice(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	): Promise<void> {
		console.log("Creating Multiple Choice content type.");
		jsonfile = jsonfile.trim();
		outputfile = outputfile.trim();

		const contentData = await fs.readJson(jsonfile, { encoding });

		const h5pPackage = await H5pPackage.createFromHub(
			"H5P.DiscreteOptionMultiChoice",
			language
		);
		const multipleChoiceCreator = new MultipleChoiceCreator(
			h5pPackage,
			contentData,
			path.dirname(jsonfile)
		);
		await multipleChoiceCreator.create();
		await multipleChoiceCreator.savePackage(outputfile);

		console.log(`H5P package created at ${outputfile}`);
	}
}

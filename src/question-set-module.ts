// question-set-module.ts

import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";

import { QuestionSetCreator } from "./question-set-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for Question Set.
 */
export class QuestionSetModule implements yargs.CommandModule {
	public command = "trueorfalseSet <input> <output>";
	public describe =
		"Converts simplified JSON input to H5P True or False Quiz Set content. The JSON should include title and questions for two-choice questions.";
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
				describe: "Encoding of the input JSON file",
				default: "utf8",
				type: "string",
			});

	public handler = async (argv: yargs.Arguments) => {
		await this.runQuestionSet(
			argv.input as string,
			argv.output as string,
			argv.e as BufferEncoding,
			argv.l as string
		);
	};

	private async runQuestionSet(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	): Promise<void> {
		console.log("Creating Question Set content type.");
		jsonfile = jsonfile.trim();
		outputfile = outputfile.trim();

		const contentData = await fs.readJson(jsonfile, { encoding });

		const h5pPackage = await H5pPackage.createFromHub(
			"H5P.QuestionSet",
			language
		);
		const questionSetCreator = new QuestionSetCreator(
			h5pPackage,
			contentData,
			path.dirname(jsonfile)
		);
		await questionSetCreator.create();
		await questionSetCreator.savePackage(outputfile);

		console.log(`H5P package created at ${outputfile}`);
	}
}

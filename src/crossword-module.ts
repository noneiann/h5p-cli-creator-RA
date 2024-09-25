// crossword-module.ts

import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";

import { CrosswordCreator } from "./crossword-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for Crossword.
 */
export class CrosswordModule implements yargs.CommandModule {
	public command = "crossword <input> <output>";
	public describe =
		"Converts simplified JSON input to H5P Crossword content. The JSON should include title, taskDescription, words, optional theme with imagePath, and overallFeedback.";
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
		await this.runCrossword(
			argv.input as string,
			argv.output as string,
			argv.e as BufferEncoding,
			argv.l as string
		);
	};

	private async runCrossword(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	): Promise<void> {
		console.log("Creating Crossword content type.");
		jsonfile = jsonfile.trim();
		outputfile = outputfile.trim();

		const contentData = await fs.readJson(jsonfile, { encoding });

		const h5pPackage = await H5pPackage.createFromHub(
			"H5P.Crossword",
			language
		);
		const crosswordCreator = new CrosswordCreator(
			h5pPackage,
			contentData,
			path.dirname(jsonfile)
		);
		await crosswordCreator.create();
		await crosswordCreator.savePackage(outputfile);

		console.log(`H5P package created at ${outputfile}`);
	}
}

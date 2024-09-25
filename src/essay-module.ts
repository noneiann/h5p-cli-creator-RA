// essay-module.ts

import * as fs from "fs-extra";
import * as path from "path";
import * as yargs from "yargs";

import { EssayCreator } from "./essay-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for Essay.
 */
export class EssayModule implements yargs.CommandModule {
	public command = "essay <input> <output>";
	public describe =
		"Converts simplified JSON input to H5P Essay content. The JSON should include title, taskDescription, keywords, behaviour, and overallFeedback.";
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
		await this.runEssay(argv.input, argv.output, argv.e, argv.l);
	};

	private async runEssay(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	): Promise<void> {
		console.log("Creating Essay content type.");
		jsonfile = jsonfile.trim();
		outputfile = outputfile.trim();

		const contentData = await fs.readJson(jsonfile, { encoding });

		const h5pPackage = await H5pPackage.createFromHub("H5P.Essay", language);
		const essayCreator = new EssayCreator(
			h5pPackage,
			contentData,
			path.dirname(jsonfile)
		);
		await essayCreator.create();
		await essayCreator.savePackage(outputfile);

		console.log(`H5P package created at ${outputfile}`);
	}
}

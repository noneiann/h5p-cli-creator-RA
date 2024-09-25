import * as fs from "fs";
import * as yargs from "yargs";
import * as path from "path";

import { DictationCreator } from "./dictation-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for dictation.
 */
export class DictationModule implements yargs.CommandModule {
	public command = "dictation <input> <output>";
	public describe =
		"Converts JSON input to H5P dictation content. The JSON file should include: title, taskDescription, sentences, overallFeedback, behaviour.";
	public builder = (y: yargs.Argv) =>
		y
			.positional("input", { describe: "JSON input file" })
			.positional("output", {
				describe: "H5P output file including .h5p extension",
			})
			.option("l", {
				describe: "language for translations in H5P content",
				default: "en",
				type: "string",
			})
			.option("e", { describe: "encoding", default: "UTF-8", type: "string" });

	public handler = async (argv) => {
		await this.runDictation(argv.input, argv.output, argv.e, argv.l);
	};

	private async runDictation(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	): Promise<void> {
		console.log("Creating dictation module content.");
		jsonfile = jsonfile.trim();
		outputfile = outputfile.trim();

		let jsonData = JSON.parse(fs.readFileSync(jsonfile, encoding));
		let { title, taskDescription, sentences, overallFeedback, behaviour } =
			jsonData;

		// Create H5P package for dictation content type
		let h5pPackage = await H5pPackage.createFromHub("H5P.Dictation", language);

		// Create DictationCreator with the JSON data
		let creator = new DictationCreator(
			h5pPackage,
			title,
			taskDescription,
			sentences,
			overallFeedback,
			behaviour,
			path.dirname(jsonfile)
		);

		// Generate the H5P content
		await creator.create();
		creator.savePackage(outputfile);
	}
}

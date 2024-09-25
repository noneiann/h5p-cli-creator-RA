import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { SpeakTheWordsSetCreator } from "./speak-the-words-set-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for Speak the Words Sets.
 */
export class SpeakTheWordsSetModule implements yargs.CommandModule {
	public command = "speakthewordsset <input> <output>";
	public describe =
		"Converts JSON input to H5P Speak the Words Set content. The JSON should include introduction, questions, and overallFeedback.";
	public builder = (y: yargs.Argv) =>
		y
			.positional("input", { describe: "JSON input file" })
			.positional("output", {
				describe: "H5P output file including .h5p extension",
			})
			.option("l", {
				describe: "Language for translations in H5P content",
				default: "en",
				type: "string",
			})
			.option("e", { describe: "Encoding", default: "UTF-8", type: "string" });

	public handler = async (argv) => {
		await this.runSpeakTheWordsSet(argv.input, argv.output, argv.e, argv.l);
	};

	private async runSpeakTheWordsSet(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	): Promise<void> {
		console.log("Creating Speak the Words Set content type.");
		jsonfile = jsonfile.trim();
		outputfile = outputfile.trim();

		let jsonData = JSON.parse(fs.readFileSync(jsonfile, encoding));
		let { introduction, questions, overallFeedback } = jsonData;

		let h5pPackage = await H5pPackage.createFromHub(
			"H5P.SpeakTheWordsSet",
			language
		);
		let speakTheWordsSetCreator = new SpeakTheWordsSetCreator(
			h5pPackage,
			introduction,
			questions,
			overallFeedback,
			path.dirname(jsonfile)
		);
		await speakTheWordsSetCreator.create();
		await speakTheWordsSetCreator.savePackage(outputfile);
	}
}

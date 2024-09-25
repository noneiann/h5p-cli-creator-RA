import * as fs from "fs";
import * as yargs from "yargs";
import * as path from "path";

import { MarkTheWordsCreator } from "./markthewords-creator";
import { H5pPackage } from "./h5p-package";

export class MarkTheWordsModule implements yargs.CommandModule {
	public command = "mark-the-words <input> <output>";
	public describe = "Converts json input to h5p mark the words content.";
	public builder = (y: yargs.Argv) =>
		y
			.positional("input", { describe: "json input file" })
			.positional("output", {
				describe: "h5p output file including .h5p extension",
			})
			.option("l", {
				describe: "language for translations in h5p content",
				default: "en",
				type: "string",
			})
			.option("e", { describe: "encoding", default: "UTF-8", type: "string" });

	public handler = async (argv) => {
		await this.runMarkTheWords(argv.input, argv.output, argv.e, argv.l);
	};

	private async runMarkTheWords(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	): Promise<void> {
		console.log("Creating module content type.");
		jsonfile = jsonfile.trim();
		outputfile = outputfile.trim();

		let jsonData = JSON.parse(fs.readFileSync(jsonfile, encoding));
		let { title, taskDescription, textField, overallFeedback } = jsonData;
		let h5pPackage = await H5pPackage.createFromHub(
			"H5P.MarkTheWords",
			language
		);

		let creator = new MarkTheWordsCreator(
			h5pPackage,
			title,
			taskDescription,
			textField,
			overallFeedback,
			path.dirname(jsonfile)
		);
		await creator.create();
		creator.setTitle(title);
		creator.savePackage(outputfile);
	}
}

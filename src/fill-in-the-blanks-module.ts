import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { FillInTheBlanksCreator } from "./fill-in-the-blanks-creator";
import { H5pPackage } from "./h5p-package";

export class FillInTheBlanksModule implements yargs.CommandModule {
	public command = "fill-in-the-blanks <input> <output>";
	public describe =
		"Converts JSON input to H5P fill-in-the-blanks content.";
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
		await this.runFillInTheBlanks(
			argv.input,
			argv.output,
			argv.e,
			argv.l
		);
	};

	private async runFillInTheBlanks(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	) {
		// Read the JSON file
		const jsonData = JSON.parse(fs.readFileSync(jsonfile, { encoding }));

		// Extract the required fields from JSON
		const { title, description, questions } = jsonData;

		// Create an H5P package
		const h5pPackage = await H5pPackage.createFromHub("H5P.Blanks", language);

		// Create the FillInTheBlanks content
		const creator = new FillInTheBlanksCreator(
			h5pPackage,
			questions, // assuming questions is an array in the JSON
			title,
			description,
			path.dirname(jsonfile)
		);

		// Create and save the package
		await creator.create();
		await creator.savePackage(outputfile);
	}
}

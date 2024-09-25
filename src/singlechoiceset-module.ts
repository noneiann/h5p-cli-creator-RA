import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { SingleChoiceSetCreator } from "./singlechoiceset-creator";
import { H5pPackage } from "./h5p-package";

export class SingleChoiceSetModule implements yargs.CommandModule {
	public command = "single-choice-set <input> <output>";
	public describe = "Converts JSON input to H5P single-choice-set content.";
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
		await this.runSingleChoiceSet(argv.input, argv.output, argv.e, argv.l);
	};

	private async runSingleChoiceSet(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	) {
		// Read the JSON file
		const jsonData = JSON.parse(fs.readFileSync(jsonfile, { encoding }));

		// Destructure the JSON to get the necessary fields
		const { title, choices, behaviour } = jsonData;

		// Create an H5P package using the SingleChoiceSetCreator
		const h5pPackage = await H5pPackage.createFromHub(
			"H5P.SingleChoiceSet",
			language
		);

		const creator = new SingleChoiceSetCreator(
			h5pPackage,
			title,
			choices,
			behaviour
		);

		// Create the content and save the package
		await creator.create();
		await creator.savePackage(outputfile);
	}
}

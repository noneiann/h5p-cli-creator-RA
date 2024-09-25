import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { SummaryCreator } from "./summary-creator";
import { H5pPackage } from "./h5p-package";

export class SummaryModule implements yargs.CommandModule {
	public command = "summary <input> <output>";
	public describe = "Converts JSON input to H5P Summary content.";
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
		await this.runSummary(argv.input, argv.output, argv.e, argv.l);
	};

	private async runSummary(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	) {
		// Read the JSON file
		const jsonData = JSON.parse(fs.readFileSync(jsonfile, { encoding }));

		// Destructure the JSON to get the necessary fields
		const { title, intro, summaries, overallFeedback } = jsonData;

		// Create an H5P package using the SummaryCreator
		const h5pPackage = await H5pPackage.createFromHub("H5P.Summary", language);

		const creator = new SummaryCreator(
			h5pPackage,
			title,
			intro,
			summaries,
			overallFeedback
		);

		// Create the content and save the package
		await creator.create();
		await creator.savePackage(outputfile);
	}
}

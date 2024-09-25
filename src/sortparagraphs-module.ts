import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { SortParagraphsCreator } from "./sortparagraphs-creator"; // Import the creator class
import { H5pPackage } from "./h5p-package"; // Import the H5P package class

export class SortParagraphsModule implements yargs.CommandModule {
	public command = "sort-paragraphs <input> <output>";
	public describe = "Converts JSON input to H5P Sort Paragraphs content.";
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
		await this.runSortParagraphs(argv.input, argv.output, argv.e, argv.l);
	};

	private async runSortParagraphs(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	) {
		// Read the JSON file
		const jsonData = JSON.parse(fs.readFileSync(jsonfile, { encoding }));

		// Destructure the JSON to get the necessary fields
		const { title, taskDescription, paragraphs, overallFeedback, behaviour } =
			jsonData;

		// Create an H5P package using the SortParagraphsCreator
		const h5pPackage = await H5pPackage.createFromHub(
			"H5P.SortParagraphs",
			language
		);

		const creator = new SortParagraphsCreator(
			h5pPackage,
			title,
			taskDescription,
			paragraphs,
			overallFeedback,
			behaviour
		);

		// Create the content and save the package
		await creator.create();
		await creator.savePackage(outputfile);
	}
}

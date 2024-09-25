import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { PickTheSymbolsCreator } from "./pickthesymbols-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for Pick the Symbols.
 */
export class PickTheSymbolsModule implements yargs.CommandModule {
	public command = "pickthesymbols <input> <output>";
	public describe =
		"Converts JSON input to H5P Pick the Symbols content. The JSON should include taskDescription, text, symbols, overallFeedback, and behaviour.";
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
		await this.runPickTheSymbols(argv.input, argv.output, argv.e, argv.l);
	};

	private async runPickTheSymbols(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	): Promise<void> {
		console.log("Creating Pick the Symbols content type.");
		jsonfile = jsonfile.trim();
		outputfile = outputfile.trim();

		const jsonData = JSON.parse(fs.readFileSync(jsonfile, encoding));
		const {
			title,
			taskDescription,
			text,
			symbols,
			overallFeedback,
			behaviour,
		} = jsonData;

		const h5pPackage = await H5pPackage.createFromHub(
			"H5P.PickTheSymbols", // Replace with the correct H5P content type identifier if different
			language
		);
		const pickTheSymbolsCreator = new PickTheSymbolsCreator(
			h5pPackage,
			title,
			taskDescription,
			text,
			symbols,
			overallFeedback,
			behaviour,
			path.dirname(jsonfile)
		);
		await pickTheSymbolsCreator.create();
		await pickTheSymbolsCreator.savePackage(outputfile);
	}
}

import * as fs from "fs";
import * as papa from "papaparse";
import * as path from "path";
import * as yargs from "yargs";

import { FillInTheBlanksCreator } from "./fill-in-the-blanks-creator";
import { H5pPackage } from "./h5p-package";

export class FillInTheBlanksModule implements yargs.CommandModule {
	public command = "fill-in-the-blanks <input> <output>";
	public describe =
		"Converts csv input to h5p fill-in-the-blanks content. The headings for the columns \
                     should be: text, question1, question2, ...";
	public builder = (y: yargs.Argv) =>
		y
			.positional("input", { describe: "csv input file" })
			.positional("output", {
				describe: "h5p output file including .h5p extension",
			})
			.option("l", {
				describe: "language for translations in h5p content",
				default: "en",
				type: "string",
			})
			.option("d", { describe: "CSV delimiter", default: "", type: "string" })
			.option("e", { describe: "encoding", default: "UTF-8", type: "string" })
			.option("t", {
				describe: "title of the content",
				default: "Fill in the blanks",
				type: "string",
			})
			.option("des", {
				describe: "description of the content",
				default: "Fill in the blanks.",
				type: "string",
			});

	public handler = async (argv) => {
		await this.runFillInTheBlanks(
			argv.input,
			argv.output,
			argv.t,
			argv.e,
			argv.d,
			argv.l,
			argv.description
		);
	};

	private async runFillInTheBlanks(
		csvfile: string,
		outputfile: string,
		title: string,
		encoding: BufferEncoding,
		delimiter: string,
		language: string,
		description: string
	) {
		let csv = fs.readFileSync(csvfile, { encoding });
		const data = papa.parse(csv, {
			header: true,
			delimiter: delimiter,
			skipEmptyLines: true,
		});
		let h5pPackage = await H5pPackage.createFromHub("H5P.Blanks", language);
		const creator = new FillInTheBlanksCreator(
			h5pPackage,
			data.data as any,
			title,
			description,
			path.dirname(csvfile)
		);
		await creator.create();
		creator.savePackage(outputfile);
	}
}

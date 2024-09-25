import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";
import { SpeakTheWordsCreator } from "./speakthewords-creator";
import { H5pPackage } from "./h5p-package";

export class SpeakTheWordsModule implements yargs.CommandModule {
	public command = "speak-the-words <input> <output>";
	public describe = "Converts JSON input to H5P speak-the-words content.";

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
		await this.runSpeakTheWords(argv.input, argv.output, argv.e, argv.l);
	};

	private async runSpeakTheWords(
		jsonfile: string,
		outputfile: string,
		encoding: BufferEncoding,
		language: string
	) {
		// Read the JSON file
		const jsonData = JSON.parse(fs.readFileSync(jsonfile, { encoding }));

		// Destructure the JSON to get title, description, and data
		const { title, question, acceptedAnswers, inputLanguage, introduction } =
			jsonData;

		// Create an H5P package using the SpeakTheWords creator
		const h5pPackage = await H5pPackage.createFromHub(
			"H5P.SpeakTheWords",
			language
		);

		const creator = new SpeakTheWordsCreator(
			h5pPackage,
			title,
			question,
			acceptedAnswers,
			inputLanguage,
			path.dirname(jsonfile)
		);

		await creator.create();
		await creator.savePackage(outputfile);
	}
}

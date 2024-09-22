import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { FlashcardsCreator } from "./flashcards-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for flashcards.
 */
export class FlashcardsModule implements yargs.CommandModule {
  public command = "flashcards <input> <output>";
  public describe =
    "Converts JSON input to H5P flashcard content. The JSON should be an object with properties: title, description, and flashcards (an array of objects with keys: question, answer, [tip], [image]).";
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
    await this.runFlashcards(argv.input, argv.output, argv.e, argv.l);
  };

  private async runFlashcards(
    jsonfile: string,
    outputfile: string,
    encoding: BufferEncoding,
    language: string
  ): Promise<void> {
    console.log("Creating flashcards content type.");
    jsonfile = jsonfile.trim();
    outputfile = outputfile.trim();

    let jsonData = JSON.parse(fs.readFileSync(jsonfile, encoding));
    let { title, description, flashcards } = jsonData;

    let h5pPackage = await H5pPackage.createFromHub("H5P.Flashcards", language);
    let flashcardsCreator = new FlashcardsCreator(
      h5pPackage,
      flashcards,
      description,
      title,
      path.dirname(jsonfile)
    );
    await flashcardsCreator.create();
    flashcardsCreator.savePackage(outputfile);
  }
}

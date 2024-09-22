import * as fs from "fs";
import * as yargs from "yargs";
import * as path from "path";

import { DialogCardsCreator } from "./dialogcards-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for dialogcards.
 */
export class DialogCardsModule implements yargs.CommandModule {
  public command = "dialogcards <input> <output>";
  public describe =
    "Converts csv input to h5p dialog cards content. The headings for the columns \
                     should be: front, back, [image] (image is the URL of an image to include)";
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
      .option("e", { describe: "encoding", default: "UTF-8", type: "string" })

  public handler = async (argv) => {
    await this.runDialogcards(
      argv.input,
      argv.output,
      argv.e,
      argv.l,
    );
  };

  private async runDialogcards(
    jsonfile: string,
    outputfile: string,
    encoding: BufferEncoding,
    language: string,
  ): Promise<void> {
    console.log("Creating module content type.");
    jsonfile = jsonfile.trim();
    outputfile = outputfile.trim();

    let jsonData = JSON.parse(fs.readFileSync(jsonfile, encoding ));
    let { title, description, mode, data } = jsonData;
    let h5pPackage = await H5pPackage.createFromHub(
      "H5P.DialogCards",
      language
    );
    let creator = new DialogCardsCreator(
      h5pPackage,
      title,
      description,
      data,
      mode,
      path.dirname(jsonfile)
    );
    await creator.create();
    creator.setTitle(title);
    creator.savePackage(outputfile);
  }
}

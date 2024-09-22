import * as fs from "fs";
import * as yargs from "yargs";
import * as path from "path";

import { FindTheWordsCreator } from "./findthewords-creator";
import { H5pPackage } from "./h5p-package";

/**
 * This is the yargs module for findthewords.
 */
export class FindTheWordsModule implements yargs.CommandModule {
    public command = "findthewords <input> <output>";
    public describe =
        "Converts JSON input to H5P find the words content. The structure of the JSON \
         should include: title, description, and words.";
    
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
        await this.runFindTheWords(
            argv.input,
            argv.output,
            argv.e,
            argv.l
        );
    };

    private async runFindTheWords(
        jsonfile: string,
        outputfile: string,
        encoding: BufferEncoding,
        language: string
    ): Promise<void> {
        console.log("Creating module content type.");
        jsonfile = jsonfile.trim();
        outputfile = outputfile.trim();

        // Read and parse the JSON file
        let jsonData = JSON.parse(fs.readFileSync(jsonfile, { encoding }));
        
        let h5pPackage = await H5pPackage.createFromHub("H5P.FindTheWords", language);
        
        let findthewordscreator = new FindTheWordsCreator(
            h5pPackage,
            jsonData.words as any, // Assuming `words` is the key in the JSON for the list of words
            jsonData.description,
            jsonData.title,
            path.dirname(jsonfile)
        );
        
        await findthewordscreator.create();
        findthewordscreator.savePackage(outputfile);
    }
}

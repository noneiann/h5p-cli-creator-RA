import * as fs from "fs";
import * as path from "path";
import * as yargs from "yargs";

import { DragTextCreator } from "./dragtext-creator";
import { H5pPackage } from "./h5p-package";
import { log } from "console";

export class DragTextModule implements yargs.CommandModule {
    public command = "drag-text <input> <output>";
    public describe = "Converts JSON input to H5P drag-text content.";
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
            .option("e", { describe: "encoding", default: "UTF-8", type: "string" })

    public handler = async (argv) => {
        await this.runDragText(
            argv.input,
            argv.output,
            argv.e,
            argv.l,

        );
    };

    private async runDragText(
        jsonfile: string,
        outputfile: string,
        encoding: BufferEncoding,
        language: string,
    ) {
        // Read the JSON file
        const jsonData = JSON.parse(fs.readFileSync(jsonfile, { encoding }));
        
        // Destructure the JSON to get title, description, and data
        const { title, taskDescription } = jsonData;
        const textField = jsonData.textField;
        // Create an H5P package using the DragText creator
        const h5pPackage = await H5pPackage.createFromHub("H5P.DragText", language);
        const creator = new DragTextCreator(
            h5pPackage,
            title,
            taskDescription,
            textField,
            path.dirname(jsonfile)
        );
        await creator.create();
        await creator.savePackage(outputfile);
    }
}

import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5pDragTextContent } from "./models/h5p-dragtext-content";
import { string } from "yargs";
import { text } from "stream/consumers";

export class DragTextCreator extends ContentCreator<H5pDragTextContent> {
    constructor(
        h5pPackage: H5pPackage,
        private title: string,
        private taskDescription: string,
        private textField: string[],
        sourcePath: string
    ) {
        super(h5pPackage, sourcePath);
    }

    protected contentObjectFactory(): H5pDragTextContent {
        return new H5pDragTextContent();
    }

    protected async addContent(
        contentObject: H5pDragTextContent
    ): Promise<void> {
        // Join the textfield array with '\n' separator
        contentObject.textField = this.textField.join('\n');
 
        // Assign the joined string to contentObject's taskDescription
        contentObject.taskDescription = this.taskDescription;
 // Assuming contentObject has a textField property
    }
    
    
    protected addSettings(contentObject: H5pDragTextContent) {
        this.h5pPackage.h5pMetadata.title = this.title;
        this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);

        contentObject.behaviour = {
            enableRetry: false,
            enableSolutionsButton: true,
            instantFeedback: true,
            enableCheckButton: true,
        };
    }
}
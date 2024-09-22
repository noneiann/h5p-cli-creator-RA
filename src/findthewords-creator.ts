import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import { H5PFindTheWordsContent } from "./models/h5p-find-the-words-content";

export class FindTheWordsCreator extends ContentCreator<H5PFindTheWordsContent> {
    constructor(
        h5pPackage: H5pPackage,
        private words: string[],  // Directly accept an array of words from JSON
        private description: string,
        private title: string,
        sourcePath: string
    ) {
        super(h5pPackage, sourcePath);
    }

    protected contentObjectFactory(): H5PFindTheWordsContent {
        return new H5PFindTheWordsContent();
    }

    protected async addContent(
        contentObject: H5PFindTheWordsContent
    ): Promise<void> {
        // The `words` array is already a list of words
        contentObject.wordList = this.words.join(",");
    }

    protected addSettings(contentObject: H5PFindTheWordsContent) {
        this.h5pPackage.h5pMetadata.title = this.title;
        this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);

        contentObject.taskDescription = this.description;
        contentObject.behaviour = {
            orientations: {
                horizontal: true,
                horizontalBack: true,
                vertical: true,
                verticalUp: true,
                diagonal: true,
                diagonalBack: true,
                diagonalUp: true,
                diagonalUpBack: true,
            },
            fillPool: "abcdefghijklmnopqrstuvwxyz",
            preferOverlap: true,
            showVocabulary: true,
            enableShowSolution: true,
            enableRetry: true,
        };
    }
}

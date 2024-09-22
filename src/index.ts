#!usr/bin/env node

import * as yargs from "yargs";
import { DialogCardsModule } from "./dialogcards-module";
import { FlashcardsModule } from "./flashcards-module";
import { FillInTheBlanksModule } from "./fill-in-the-blanks-module";
import { DragTextModule } from "./dragtext-module";
import { FindTheWordsModule } from "./findthewords-module";
import { DragAndDropModule } from "./draganddrop-module";
import { ImagePairCreator } from "./imagepair-creator";
import { ImagePairModule } from "./imagepair-module";
import { MemoryGameCreator } from "./memorygame-creator";
import { MemoryGameModule } from "./memorygame-module";
try {
	yargs
		.command(new FlashcardsModule())
		.command(new DialogCardsModule())
		.command(new FillInTheBlanksModule())
		.command(new DragTextModule())
		.command(new FindTheWordsModule())
		.command(new DragAndDropModule())
		.command(new ImagePairModule())
		.command(new MemoryGameModule())
		.help().argv;
} catch (error) {
	console.error(error);
}

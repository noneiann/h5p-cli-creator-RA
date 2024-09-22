#!usr/bin/env node

import * as yargs from "yargs";
import { DialogCardsModule } from "./dialogcards-module";
import { FlashcardsModule } from "./flashcards-module";
import { FillInTheBlanksModule } from "./fill-in-the-blanks-module";
try {
	yargs
		.command(new FlashcardsModule())
		.command(new DialogCardsModule())
		.command(new FillInTheBlanksModule())
		.help().argv;
} catch (error) {
	console.error(error);
}

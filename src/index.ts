#!usr/bin/env node

import * as yargs from "yargs";
import { DialogCardsModule } from "./dialogcards-module";
import { FlashcardsModule } from "./flashcards-module";
import { FillInTheBlanksModule } from "./fill-in-the-blanks-module";
import { DragTextModule } from "./dragtext-module";
import { FindTheWordsModule } from "./findthewords-module";
import { DragAndDropModule } from "./draganddrop-module";
import { ImagePairModule } from "./imagepair-module";
import { MemoryGameModule } from "./memorygame-module";
import { SpeakTheWordsModule } from "./speakthewords-module";
import { MarkTheWordsModule } from "./markthewords-module";
import { DictationModule } from "./dictation-module";
import { SingleChoiceSetModule } from "./singlechoiceset-module";
import { SortParagraphsModule } from "./sortparagraphs-module";
import { SummaryModule } from "./summary-module";
import { SpeakTheWordsSetModule } from "./SpeakTheWordsSetModule";
import { PickTheSymbolsModule } from "./pickthesymbols-module";
import { MultipleChoiceModule } from "./multichoice-module";
import { EssayModule } from "./essay-module";
import { CrosswordModule } from "./crossword-module";
import { QuestionSetModule } from "./question-set-module";

try {
	yargs
		.command(new FlashcardsModule())
		.command(new DialogCardsModule())
		.command(new FillInTheBlanksModule())
		.command(new DragTextModule())
		.command(new FindTheWordsModule())
		.command(new ImagePairModule())
		.command(new MemoryGameModule())
		.command(new SpeakTheWordsModule())
		.command(new MarkTheWordsModule())
		.command(new DictationModule())
		.command(new SingleChoiceSetModule())
		.command(new SortParagraphsModule())
		.command(new SummaryModule())
		.command(new SpeakTheWordsSetModule())
		.command(new PickTheSymbolsModule())
		.command(new MultipleChoiceModule())
		.command(new EssayModule())
		.command(new CrosswordModule())
		.command(new QuestionSetModule())
		.help().argv;
} catch (error) {
	console.error(error);
}

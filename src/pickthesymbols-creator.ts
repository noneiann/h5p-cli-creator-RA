import * as path from "path";

import { ContentCreator } from "./content-creator";
import { H5pPackage } from "./h5p-package";
import {
	H5pPickTheSymbols,
	Behaviour,
} from "./models/h5p-pickthesymbols-content";

export class PickTheSymbolsCreator extends ContentCreator<H5pPickTheSymbols> {
	private behaviour: Behaviour;

	constructor(
		h5pPackage: H5pPackage,
		private title: string,
		private taskDescription: string,
		private text: string,
		private symbols: string,
		private overallFeedback: any[],
		behaviour: any,
		sourcePath: string
	) {
		super(h5pPackage, sourcePath);
		// Initialize behaviour with defaults
		this.behaviour = {
			enableRetry: behaviour.enableRetry || false,
			enableSolutionsButton: behaviour.enableSolutionsButton || true,
			infiniteChecking: behaviour.infiniteChecking || false,
			showAllBlanks: behaviour.showAllBlanks || true,
			colorBackground: behaviour.colorBackground || "#ffffff",
		};
		this.symbols = symbols || ".,?!&quot;";
	}

	protected contentObjectFactory(): H5pPickTheSymbols {
		return new H5pPickTheSymbols();
	}

	protected async addContent(contentObject: H5pPickTheSymbols): Promise<void> {
		contentObject.taskDescription = this.taskDescription;
		contentObject.text = this.text;
		contentObject.symbols = this.symbols;
		contentObject.overallFeedback = this.overallFeedback;
	}

	protected addSettings(contentObject: H5pPickTheSymbols) {
		this.h5pPackage.h5pMetadata.title = this.title;
		this.h5pPackage.addMetadata(this.h5pPackage.h5pMetadata);
		// Set behaviour

		contentObject.behaviour = this.behaviour;
	}
}

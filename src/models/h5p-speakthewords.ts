import { H5pContent } from "./h5p-content";
import { H5pImage } from "./h5p-image";

export class H5pSpeakTheWords extends H5pContent {
	public question: string;
	public acceptedAnswers: string[];
	public inputLanguage: string;
}

import { H5pContent } from "./h5p-content";

export class H5pSpeakTheWords extends H5pContent {
	public question: string;
	public acceptedAnswers: string[];
	public inputLanguage: string;
}

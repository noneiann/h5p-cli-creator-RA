import { H5pContent } from "./h5p-content";
import { H5pImage } from "./h5p-image";

export class TrueOrFalseSet extends H5pContent {
	public questions: {
		question: string;
		correctAnswer: boolean;
		explanation: string;
		image?: H5pImage;
	}[];
}

import { H5pContent } from "./h5p-content";

export class H5pDragTextContent extends H5pContent {
    public taskDescription: string;
    public textField: string;
    public behaviour: {
        enableRetry: boolean;
        enableSolutionsButton: boolean;
        instantFeedback: boolean;
        enableCheckButton: boolean;
    }
    public overallFeedback: [
        {
            "from": 0,
            "to": 100,
            "feedback": "Score: @score of @total."
        }
    ]

}
export interface IQuestionsConfig {
  question_type: string;
  isThisPassageHaveQuestion: "yes" | "no" | "";
  no_of_options: number;
  isThereHeaderInfo: boolean;
  header_info: string;
  isThereFooterInfo: boolean;
  footer_info: string;
  isThereBlanks: boolean;
  no_of_blanks: number;
  blank_options: number[];
}


export interface INonBlankBlock {
  options: string[];
  answer: number[];
}
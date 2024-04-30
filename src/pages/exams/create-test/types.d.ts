export interface IQuestionsConfig {
  question_type: string;
  isThisPassageHaveQuestion: "yes" | "no" | "";
  no_of_options: number;
  isThereBlanks: boolean;
  no_of_blanks: number;
  isThereHeaderInfo: boolean;
  header_info: string;
  isThereFooterInfo: boolean;
  footer_info: string;
  blank_options: number;
}


import { Label } from "@/components/ui/label";
import { FC, useState } from "react";
import OptionsList from "./options-list";
import { INonBlankBlock } from "../../types";
import AnswersList from "./answers";

interface NonBlankBlockProps {
  noOfOptions: number;
  getData: INonBlankBlock;
  sendData: (options: INonBlankBlock) => void;
}

const NonBlankBlock: FC<NonBlankBlockProps> = ({
  noOfOptions,
  getData,
  sendData,
}) => {
  const [answers, setAnswers] = useState<number[]>(getData.answer);
  const [options, setOptions] = useState<string[]>(getData.options);

  return (
    <div>
      <div className="bg-indigo-50 rounded p-3 my-2">
        <Label>Options</Label>
        <OptionsList
          noOfOptions={noOfOptions}
          getData={options}
          sendData={(option) => {
            setOptions(option), sendData({ options: option, answer: answers });
          }}
        />
      </div>
      <div className="bg-pink-50 rounded p-3 my-2">
        <Label>Answers</Label>
        <AnswersList
          noOfOptions={noOfOptions}
          getData={answers}
          sendData={(ans) => {
            setAnswers(ans), sendData({ options, answer: ans });
          }}
        />
      </div>
    </div>
  );
};

export default NonBlankBlock;

import { Checkbox } from "@/components/ui/checkbox";
import { FC, useEffect, useState } from "react";

interface AnswersListProps {
  noOfOptions: number;
  getData: number[];
  sendData: (options: number[]) => void;
}

const AnswersList: FC<AnswersListProps> = ({
  noOfOptions,
  getData,
  sendData,
}) => {
  const [answers, setAnswers] = useState<number[]>(getData);

  const eventHandler = (value: boolean, idx: number) => {
    if (value) {
      let a = [...new Set([...answers, idx])]
        .sort((a, b) => a - b)
        .filter((ans) => ans > 0);
      setAnswers(a);
      sendData(a);
    } else {
      let b = [...new Set(answers.filter((ans) => ans !== idx))]
        .sort((a, b) => a - b)
        .filter((ans) => ans > 0);
      setAnswers(b);
      sendData(b);
    }
  };

  return (
    <div className="flex justify-start gap-2">
      {[...Array(Number(noOfOptions))].map((_, opi) => (
        <div
          className="flex justify-start items-center space-x-1"
          key={"answers" + opi + 1}
        >
          <Checkbox
            id={`answers-${opi + 1}`}
            checked={answers.includes(opi + 1)}
            onCheckedChange={(e: boolean) => {
              eventHandler(e, opi + 1);
            }}
          />
          <label
            htmlFor={`answers-${opi} `}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {opi + 1}
          </label>
        </div>
      ))}
    </div>
  );
};

export default AnswersList;

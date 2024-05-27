import { FC, useEffect, useState } from "react";
import { INonBlankBlock } from "../../types";
import NonBlankBlock from "./nonBlanks";
import { Label } from "@/components/ui/label";

interface NonBlankBlockProps {
  blank_options: number[];
  getData: INonBlankBlock[];
  sendData: (options: INonBlankBlock[]) => void;
}

const BlanksBlock: FC<NonBlankBlockProps> = ({
  blank_options,
  getData,
  sendData,
}) => {
  const [data, setData] = useState<INonBlankBlock[]>([]);

  useEffect(() => {
    if (blank_options.length > getData.length) {
      const diff = blank_options.length - getData.length;
      const newBlocks = Array.from({ length: diff }, () => ({
        options: [],
        answer: [],
      }));
      setData([...getData, ...newBlocks]);
      sendData([...getData, ...newBlocks]);
    } else if (blank_options.length < getData.length) {
      const diff = getData.length - blank_options.length;
      const newBlocks = getData.slice(0, diff);
      setData(newBlocks);
      sendData(newBlocks);
    } else {
      setData(getData);
    }
  }, [getData.length, blank_options.length]);

  return (
    <div className="grid grid-cols-12 gap-2 my-2">
      {data.length > 0 &&
        blank_options.map((options, index) => (
          <div className=" col-span-12 sm:col-span-6 md:col-span-4 bg-slate-900 p-3 rounded-xl">
            <Label className="text-white">Blank {index + 1} Options And Answers</Label>
            <NonBlankBlock
              key={"block-blanks-" + index}
              noOfOptions={options}
              getData={{
                options: data[index]?.options || [],
                answer: data[index]?.answer || [],
              }}
              sendData={(e) => {
                const newBlocks = data;
                newBlocks[index] = e;
                setData(newBlocks);
                sendData(newBlocks);
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default BlanksBlock;

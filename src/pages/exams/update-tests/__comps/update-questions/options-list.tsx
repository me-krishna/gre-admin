import Editor from "@/components/custom/editor";
import { Label } from "@/components/ui/label";
import { FC, useEffect, useState } from "react";

interface OptionsProps {
  noOfOptions: number;
  getData: string[];
  sendData: (options: string[]) => void;
}

const OptionsList: FC<OptionsProps> = ({ noOfOptions, getData, sendData }) => {
  const [options, setOptions] = useState<string[]>([]);

  const handleChange = (value: string, index: number) => {
    setOptions((prev) => {
      prev[index] = value;
      return [...prev];
    });
    sendData(options);
  };

  useEffect(() => {
    if (getData.length > noOfOptions) {
      sendData(getData.slice(0, noOfOptions));
    } else if (getData.length < noOfOptions) {
      setOptions([...getData, ...Array(noOfOptions - getData.length).fill("")]);
    } else {
      setOptions(getData);
    }
  }, [noOfOptions, getData.length]);

  return (
    <>
      {options.map((data, opi) => (
        <div key={"options-comp" + opi}>
          <Editor
            filedName={`options-${opi + 1}`}
            data={data}
            placeholder={`Enter Option ${opi + 1} here`}
            onChange={(value) => handleChange(value, opi)}
          />
        </div>
      ))}
    </>
  );
};

export default OptionsList;

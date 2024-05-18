import api from "@/api/api";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FC, useEffect, useState } from "react";
import { IQuestionsConfig } from "../../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface QuestionConfigProps {
  propData: IQuestionsConfig;
  sendData: (data: IQuestionsConfig) => void;
  status?: number;
}

type TShowHide = "no_of_options_blanks" | "option-parent" | "no_of_options";

const QuestionConfig: FC<QuestionConfigProps> = ({
  propData,
  sendData,
  status,
}) => {
  const [listOfQuestiontypes, setListOfQuestiontypes] = useState<any[]>([]);

  const [data, setData] = useState<IQuestionsConfig>(propData);

  const handleInputs = (val: any, key: string) => {
    if (key === "no_of_blanks") {
      const blankOptions =
        data.no_of_blanks > val
          ? data.blank_options.slice(0, val)
          : data.blank_options.concat(
              Array.from({ length: val - data.no_of_blanks }, () => 0)
            );
      setData({
        ...data,
        [key]: val,
        blank_options: blankOptions,
      });
      status != 2 &&
        sendData({
          ...data,
          [key]: val,
          blank_options: blankOptions,
        });
      return;
    }
    if (key === "isThereBlanks" && val === false) {
      setData({
        ...data,
        [key]: val,
        no_of_blanks: 0,
        blank_options: [],
      });
      status != 2 &&
        sendData({
          ...data,
          [key]: val,
          no_of_blanks: 0,
          blank_options: [],
        });
    } else {
      setData({
        ...data,
        [key]: val,
      });
      status != 2 &&
        sendData({
          ...data,
          [key]: val,
        });
    }
  };

  const handleBlankOptions = (val: number, index: number) => {
    const blankOptions = data.blank_options;
    blankOptions[index] = val;
    setData({
      ...data,
      blank_options: blankOptions,
    });
    status != 2 &&
      sendData({
        ...data,
        blank_options: blankOptions,
      });
  };

  const getQuestionTypes = async () => {
    try {
      const res = await api.get("/question-types", {
        params: {
          type: "active",
        },
      });
      const { status, data } = res;
      if (status === 200) {
        setListOfQuestiontypes(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuestionType = (e: string) => {
    // status !== 2
    //   &&
       sendData({
          ...data,
          question_type: e,
          blank_options: [],
          isThereBlanks: false,
          no_of_blanks: 0,
          isThisPassageHaveQuestion: "",
          no_of_options: 0,
        })
       setData({
          ...data,
          question_type: e,
          blank_options: [],
          isThereBlanks: false,
          no_of_blanks: 0,
          isThisPassageHaveQuestion: "",
          no_of_options: 0,
        });
  };

  const showHide = (value: TShowHide): boolean => {
    switch (value) {
      case "no_of_options":
        return (
          (data.question_type === "type1" &&
            data.isThisPassageHaveQuestion === "yes") ||
          (data.question_type === "type2" && data.isThereBlanks === false)
        );
      case "no_of_options_blanks":
        return data.isThereBlanks === true && data.no_of_blanks > 0;
      case "option-parent":
        return showHide("no_of_options") || showHide("no_of_options_blanks");
      default:
        return false;
    }
  };

  useEffect(() => {
    getQuestionTypes();
  }, []);

  return (
    <div className="bg-blue-50 rounded p-3 my-2 relative">
      {status != 2 && (
        <div className="absolute top-0 right-0 w-full h-full z-50 bg-black bg-opacity-10 rounded-lg"></div>
      )}
      <Label>Question Configuration </Label>
      <div className="grid grid-cols-12 gap-2 bg-white p-3 rounded-md my-2">
        <div className="my-3 col-span-12 sm:col-span-6 md:col-span-4">
          <Label>Question Type</Label>
          <Select
            onValueChange={(e) => handleQuestionType(e)}
            defaultValue={data.question_type}
          >
            <SelectTrigger>
              <SelectValue placeholder="Question Type" />
            </SelectTrigger>
            <SelectContent>
              {listOfQuestiontypes.map((item) => (
                <SelectItem
                  key={item.id + "question-type-list"}
                  value={item.name}
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="my-3 col-span-12 sm:col-span-6 md:col-span-4">
          <Label>Question Mode</Label>
          <Select
            onValueChange={(e) => handleInputs(e, "mode")}
            defaultValue={data.mode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Question Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {data.question_type === "type1" && (
          <div className="my-3 col-span-12 sm:col-span-6 md:col-span-4">
            <div>
              <Label>is this passage have question?</Label>
              <Select
                defaultValue={data.isThisPassageHaveQuestion}
                onValueChange={(e) =>
                  handleInputs(e, "isThisPassageHaveQuestion")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-12 gap-2  bg-white p-3 rounded-md my-2">
        {data.question_type === "type2" && (
          <div className="my-3 col-span-12 sm:col-span-6 lg:col-span-4">
            <div className="flex items-center space-x-2 my-2">
              <Checkbox
                id="blanks"
                checked={data.isThereBlanks}
                onCheckedChange={(e) => handleInputs(e, "isThereBlanks")}
              />
              <Label htmlFor="blanks">
                Select if there's a blanks in the question
              </Label>
            </div>

            {data.isThereBlanks && (
              <div className="bg-zinc-100 p-3 rounded-md my-2">
                <Label>How May Blanks ?</Label>
                <Input
                  onChange={(e) => handleInputs(e.target.value, "no_of_blanks")}
                  value={data.no_of_blanks}
                  onWheel={(e) => (e.target as HTMLInputElement)?.blur()}
                  type="number"
                  min={1}
                  max={5}
                  placeholder="Enter No of Blanks"
                />
              </div>
            )}
          </div>
        )}
        <div className="my-3 col-span-12 sm:col-span-6 lg:col-span-4">
          <div className="flex items-center space-x-2 my-2">
            <Checkbox
              id="header-info"
              checked={data.isThereHeaderInfo}
              onCheckedChange={(e) => handleInputs(e, "isThereHeaderInfo")}
            />
            <Label
              htmlFor="header-info"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select if there's a header info
            </Label>
          </div>
          {data.isThereHeaderInfo && (
            <div className="bg-zinc-100 p-3 rounded-md my-2">
              <Label>Header Info</Label>
              <Input
                onChange={(e) => handleInputs(e.target.value, "header_info")}
                value={data.header_info}
                type="text"
                maxLength={250}
                placeholder="Enter Header Info"
              />
            </div>
          )}
        </div>
        <div className="my-3 col-span-12 sm:col-span-6 lg:col-span-4">
          <div className="flex items-center space-x-2 my-2">
            <Checkbox
              id="footer"
              checked={data.isThereFooterInfo}
              onCheckedChange={(e) => handleInputs(e, "isThereFooterInfo")}
            />
            <Label htmlFor="footer">Select if there's a Footer info</Label>
          </div>
          {data.isThereFooterInfo && (
            <div className="bg-zinc-100 p-3 rounded-md my-2">
              <Label>Footer Info</Label>
              <Input
                onChange={(e) => handleInputs(e.target.value, "footer_info")}
                value={data.footer_info}
                type="text"
                maxLength={250}
                placeholder="Enter Footer Info"
              />
            </div>
          )}
        </div>
      </div>
      {showHide("option-parent") && (
        <div className="grid grid-cols-12 gap-2  bg-white p-3 rounded-md my-2">
          {showHide("no_of_options") && (
            <div className="my-3 col-span-12 sm:col-span-6 md:col-span-4">
              <div>
                <Label>How many options does this question have?</Label>
                <Input
                  onChange={(e) =>
                    handleInputs(e.target.value, "no_of_options")
                  }
                  value={data.no_of_options}
                  onWheel={(e) => (e.target as HTMLInputElement)?.blur()}
                  type="number"
                  min={1}
                  max={10}
                  placeholder="Enter No of Options"
                />
              </div>
            </div>
          )}

          {showHide("no_of_options_blanks") && (
            <>
              {[...Array(Number(data.no_of_blanks))].map((_, i) => (
                <div
                  className="my-3 col-span-12 sm:col-span-6 md:col-span-4"
                  key={i + "block-options"}
                >
                  <div>
                    <Label>No of Options in Blanks {i + 1}</Label>
                    <Input
                      onChange={(e) =>
                        handleBlankOptions(Number(e.target.value), i)
                      }
                      onWheel={(e) => (e.target as HTMLInputElement)?.blur()}
                      value={data.blank_options[i]}
                      type="number"
                      min={1}
                      max={10}
                      placeholder="Enter No of Options in Blanks"
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default QuestionConfig;

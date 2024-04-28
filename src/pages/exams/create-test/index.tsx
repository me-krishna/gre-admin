import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconPlus } from "@tabler/icons-react";
import Editor from "@/components/custom/editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ChangeEvent, useEffect, useState } from "react";
import api from "@/api/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { set } from "date-fns";
import { get } from "http";

interface ITestData {
  pattren: string;
  testTitle: string;
  sections: ISection[];
}

interface IQuestions {
  questions_config: IQuestionsConfig;
  question: string;
  options: TOptions | TOptions[];
  answer: TOptions | TOptions[];
}

type TOptions = string[];

interface ISection {
  questions: IQuestions[];
}

interface IQuestionsConfig {
  question_type: string;
  isThisPassageHaveQuestion: "yes" | "no" | "";
  no_of_options: number;
  isThereBlanks: boolean;
  no_of_blanks: number;
  isThereHeaderInfo: boolean;
  header_info: string;
  isThereFooterInfo: boolean;
  footer_info: string;
  blank_options: {
    no_of_options: number;
  }[];
}

const CreateTest = () => {
  const _initalTestData: ITestData = {
    testTitle: "",
    pattren: "",
    sections: [
      {
        questions: [
          {
            questions_config: {
              question_type: "",
              isThisPassageHaveQuestion: "",
              no_of_options: 0,
              isThereBlanks: false,
              no_of_blanks: 0,
              isThereHeaderInfo: false,
              header_info: "",
              isThereFooterInfo: false,
              footer_info: "",
              blank_options: [
                {
                  no_of_options: 0,
                },
              ],
            },
            question: "",
            options: [],
            answer: [],
          },
        ],
      },
    ],
  };

  const [listOfExamsPattrens, setListOfExamsPattrens] = useState<any[]>([]);
  const [listOfSections, setListSections] = useState<any[]>([]);
  const [listOfQuestiontypes, setListOfQuestiontypes] = useState<any[]>([]);
  const [testData, setTestData] = useState<ITestData>(_initalTestData);

  /* API Handlers */
  const getExamsPattrens = async () => {
    try {
      const res = await api.get("/exam", {
        params: {
          page: 1,
          limit: 100,
        },
      });
      const { status, data } = res;
      if (status === 200) {
        setListOfExamsPattrens(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSectionsData = async (id: number) => {
    try {
      const res = await api.get(`/sections/${id}`);
      const { status, data } = res;
      if (status === 200) {
        const SectinsData: ISection[] = [];
        data.data.forEach((item: any) => {
          SectinsData.push({
            questions: [...Array(item.no_of_questions)].map((_) => ({
              questions_config: {
                question_type: "",
                isThisPassageHaveQuestion: "",
                no_of_options: 0,
                isThereBlanks: false,
                no_of_blanks: 0,
                isThereHeaderInfo: false,
                header_info: "",
                isThereFooterInfo: false,
                footer_info: "",
                blank_options: [
                  {
                    no_of_options: 0,
                  },
                ],
              },
              question: "",
              options: [],
              answer: [],
            })),
          });
        });
        setTestData((prev) => ({ ...prev, sections: SectinsData }));
        setListSections(data.data);
      }
    } catch (e) {
      console.error(e);
    }
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
  /* End of API Handlers */

  /* Utils */

  const getQuestionValues = (sectionIdx: number, questionIdx: number) => {
    return testData?.sections[sectionIdx]?.questions[questionIdx];
  };

  type TShowHideCases = "no_of_options" | "no_of_options_blocks";

  const showHide = (
    sectionIndex: number,
    questionIndex: number,
    value: TShowHideCases
  ) => {
    switch (value) {
      case "no_of_options":
        return (
          (getQuestionValues(sectionIndex, questionIndex).questions_config
            .question_type === "type1" &&
            getQuestionValues(sectionIndex, questionIndex).questions_config
              .isThisPassageHaveQuestion === "yes") ||
          (getQuestionValues(sectionIndex, questionIndex).questions_config
            .question_type === "type2" &&
            getQuestionValues(sectionIndex, questionIndex).questions_config
              .isThereBlanks === false)
        );
      case "no_of_options_blocks":
        return (
          getQuestionValues(sectionIndex, questionIndex).questions_config
            .isThereBlanks === true &&
          getQuestionValues(sectionIndex, questionIndex).questions_config
            .no_of_blanks > 0
        );
      default:
        return "none";
    }
  };

  /* End of Utils */

  /* Input Handlers */

  const handleQuestionsSelect = (
    value: any,
    paramName: string,
    sectionIndex: number,
    questionIndex: number
  ) => {
    setTestData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, secIndx) => ({
        questions: section.questions.map((question, qIdx) =>
          secIndx === sectionIndex && qIdx === questionIndex
            ? {
                ...question,
                questions_config: {
                  ...question.questions_config,
                  [paramName]: value,
                },
              }
            : question
        ),
      })),
    }));
  };

  const handleSlectValue = (value: string) => {
    getSectionsData(Number(value));
    setTestData((prev) => ({ ...prev, pattren: value }));
  };

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTestData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  /* End Input Handlers  */

  const getDataFromInps = (e: any) => {
    console.log(e);
  };

  const createQuestionSubmit = () => {
    console.log(testData);
    let b =
      (getQuestionValues(0, 0).questions_config.question_type === "type1" &&
        getQuestionValues(0, 0).questions_config.isThisPassageHaveQuestion ===
          "yes") ||
      (getQuestionValues(0, 0).questions_config.question_type === "type2" &&
        !getQuestionValues(0, 0).questions_config.isThereBlanks);
    console.log(b);
    // console.log(JSON.stringify(testData));
  };

  useEffect(() => {
    getExamsPattrens();
    getQuestionTypes();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Tests Factory"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                Create <IconPlus size={14} />
              </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-[90%] w-full overflow-auto">
              <SheetHeader>
                <SheetTitle>Create Test</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <div className="my-3 flex gap-2">
                  <div>
                    <Label>Exam Pattren</Label>
                    <Select
                      onValueChange={handleSlectValue}
                      defaultValue={testData.pattren}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Exam Pattren" />
                      </SelectTrigger>
                      <SelectContent>
                        {listOfExamsPattrens.map((item) => (
                          <SelectItem key={item.uuid} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Test Title</Label>
                    <Input
                      onChange={inputHandler}
                      name="testTitle"
                      type="text"
                      placeholder="Enter Test Title"
                      value={testData.testTitle}
                    />
                  </div>
                </div>
                {/* Questions Section */}
                {testData.pattren !== "" &&
                  testData.testTitle !== "" &&
                  listOfSections.length > 0 && (
                    <div className="p-2 border rounded-md">
                      <Tabs
                        defaultValue={listOfSections[0]?.uuid}
                        className="w-full"
                      >
                        <TabsList>
                          {listOfSections.map((section) => (
                            <TabsTrigger
                              key={section.uuid}
                              value={section.uuid}
                            >
                              {section.section_name}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {listOfSections.map((section, sectionIdx) => (
                          <TabsContent
                            key={section.uuid}
                            value={section.uuid}
                            className="overflow-auto"
                            defaultValue={
                              listOfSections[0].uuid + "-question-0"
                            }
                          >
                            <Accordion type="single" collapsible>
                              {[...Array(section.no_of_questions)].map(
                                (_, index) => (
                                  <AccordionItem
                                    className="border rounded-lg p-2 my-3"
                                    key={section.uuid + "-question-" + index}
                                    value={section.uuid + "-question-" + index}
                                  >
                                    <AccordionTrigger className="bg-zinc-100 px-4 rounded-md">
                                      Question {index + 1}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <div>
                                        {/* Question Configaration */}
                                        <div className="bg-blue-50 rounded p-3 my-2">
                                          <Label>Question Configuration </Label>
                                          <div className="grid grid-cols-12 gap-2 bg-white p-3 rounded-md my-2">
                                            <div className="my-3 col-span-12 sm:col-span-6 md:col-span-4">
                                              <Label>Question Type</Label>
                                              <Select
                                                onValueChange={(e) =>
                                                  handleQuestionsSelect(
                                                    e,
                                                    "question_type",
                                                    sectionIdx,
                                                    index
                                                  )
                                                }
                                                defaultValue={
                                                  getQuestionValues(
                                                    sectionIdx,
                                                    index
                                                  )?.questions_config
                                                    .question_type
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Question Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {listOfQuestiontypes.map(
                                                    (item) => (
                                                      <SelectItem
                                                        key={
                                                          item.id +
                                                          "question-type-list"
                                                        }
                                                        value={item.name}
                                                      >
                                                        {item.label}
                                                      </SelectItem>
                                                    )
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            {getQuestionValues(
                                              sectionIdx,
                                              index
                                            ).questions_config.question_type ===
                                              "type1" && (
                                              <div className="my-3 col-span-12 sm:col-span-6 md:col-span-4">
                                                <div>
                                                  <Label>
                                                    is this passage have
                                                    question?
                                                  </Label>
                                                  <Select
                                                    defaultValue={
                                                      getQuestionValues(
                                                        sectionIdx,
                                                        index
                                                      )?.questions_config
                                                        .isThisPassageHaveQuestion
                                                    }
                                                    onValueChange={(e) =>
                                                      handleQuestionsSelect(
                                                        e,
                                                        "isThisPassageHaveQuestion",
                                                        sectionIdx,
                                                        index
                                                      )
                                                    }
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Choose..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="yes">
                                                        Yes
                                                      </SelectItem>
                                                      <SelectItem value="no">
                                                        No
                                                      </SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          <div className="grid grid-cols-12 gap-2  bg-white p-3 rounded-md my-2">
                                            {getQuestionValues(
                                              sectionIdx,
                                              index
                                            ).questions_config.question_type ===
                                              "type2" && (
                                              <div className="my-3 col-span-12 sm:col-span-6 lg:col-span-4">
                                                <div className="flex items-center space-x-2 my-2">
                                                  <Checkbox
                                                    id="blanks"
                                                    checked={
                                                      getQuestionValues(
                                                        sectionIdx,
                                                        index
                                                      )?.questions_config
                                                        .isThereBlanks
                                                    }
                                                    onCheckedChange={(e) =>
                                                      handleQuestionsSelect(
                                                        e,
                                                        "isThereBlanks",
                                                        sectionIdx,
                                                        index
                                                      )
                                                    }
                                                  />
                                                  <Label htmlFor="blanks">
                                                    Select if there's a blanks
                                                    in the question
                                                  </Label>
                                                </div>

                                                {getQuestionValues(
                                                  sectionIdx,
                                                  index
                                                ).questions_config
                                                  .isThereBlanks && (
                                                  <div className="bg-zinc-100 p-3 rounded-md my-2">
                                                    <Label>
                                                      How May Blanks ?
                                                    </Label>
                                                    <Input
                                                      onChange={(e) =>
                                                        handleQuestionsSelect(
                                                          e.target.value,
                                                          "no_of_blanks",
                                                          sectionIdx,
                                                          index
                                                        )
                                                      }
                                                      value={
                                                        getQuestionValues(
                                                          sectionIdx,
                                                          index
                                                        )?.questions_config
                                                          .no_of_blanks
                                                      }
                                                      type="number"
                                                      min={1}
                                                      max={3}
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
                                                  checked={
                                                    getQuestionValues(
                                                      sectionIdx,
                                                      index
                                                    )?.questions_config
                                                      .isThereHeaderInfo
                                                  }
                                                  onCheckedChange={(e) =>
                                                    handleQuestionsSelect(
                                                      e,
                                                      "isThereHeaderInfo",
                                                      sectionIdx,
                                                      index
                                                    )
                                                  }
                                                />
                                                <Label
                                                  htmlFor="header-info"
                                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                  Select if there's header info
                                                </Label>
                                              </div>
                                              {getQuestionValues(
                                                sectionIdx,
                                                index
                                              ).questions_config
                                                .isThereHeaderInfo && (
                                                <div className="bg-zinc-100 p-3 rounded-md my-2">
                                                  <Label>Header Info</Label>
                                                  <Input
                                                    onChange={(e) =>
                                                      handleQuestionsSelect(
                                                        e.target.value,
                                                        "header_info",
                                                        sectionIdx,
                                                        index
                                                      )
                                                    }
                                                    value={
                                                      getQuestionValues(
                                                        sectionIdx,
                                                        index
                                                      )?.questions_config
                                                        .header_info
                                                    }
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
                                                  checked={
                                                    getQuestionValues(
                                                      sectionIdx,
                                                      index
                                                    )?.questions_config
                                                      .isThereFooterInfo
                                                  }
                                                  onCheckedChange={(e) =>
                                                    handleQuestionsSelect(
                                                      e,
                                                      "isThereFooterInfo",
                                                      sectionIdx,
                                                      index
                                                    )
                                                  }
                                                />
                                                <Label htmlFor="footer">
                                                  Select if there's Footer info
                                                </Label>
                                              </div>
                                              {getQuestionValues(
                                                sectionIdx,
                                                index
                                              ).questions_config
                                                .isThereFooterInfo && (
                                                <div className="bg-zinc-100 p-3 rounded-md my-2">
                                                  <Label>Footer Info</Label>
                                                  <Input
                                                    onChange={(e) =>
                                                      handleQuestionsSelect(
                                                        e.target.value,
                                                        "footer_info",
                                                        sectionIdx,
                                                        index
                                                      )
                                                    }
                                                    value={
                                                      getQuestionValues(
                                                        sectionIdx,
                                                        index
                                                      )?.questions_config
                                                        .footer_info
                                                    }
                                                    type="text"
                                                    maxLength={250}
                                                    placeholder="Enter Footer Info"
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-12 gap-2  bg-white p-3 rounded-md my-2">
                                            {showHide(
                                              sectionIdx,
                                              index,
                                              "no_of_options"
                                            ) && (
                                              <div className="my-3 col-span-12 sm:col-span-6 md:col-span-4">
                                                <div>
                                                  <Label>
                                                    How many options does this
                                                    question have?
                                                  </Label>
                                                  <Input
                                                    onChange={(e) =>
                                                      handleQuestionsSelect(
                                                        e.target.value,
                                                        "no_of_options",
                                                        sectionIdx,
                                                        index
                                                      )
                                                    }
                                                    value={
                                                      getQuestionValues(
                                                        sectionIdx,
                                                        index
                                                      )?.questions_config
                                                        .no_of_options
                                                    }
                                                    type="number"
                                                    min={1}
                                                    max={10}
                                                    placeholder="Enter No of Options"
                                                  />
                                                </div>
                                              </div>
                                            )}

                                            {showHide(
                                              sectionIdx,
                                              index,
                                              "no_of_options_blocks"
                                            ) && (
                                              <>
                                                {[
                                                  ...Array(
                                                    Number(
                                                      getQuestionValues(
                                                        sectionIdx,
                                                        index
                                                      )?.questions_config
                                                        .no_of_blanks
                                                    )
                                                  ),
                                                ].map((_, i) => (
                                                  <div
                                                    className="my-3 col-span-12 sm:col-span-6 md:col-span-4"
                                                    key={i + "block-options"}
                                                  >
                                                    <div>
                                                      <Label>
                                                        No of Options in Blocks{" "}
                                                        {i + 1}
                                                      </Label>
                                                      <Input
                                                        onChange={(e) =>
                                                          handleQuestionsSelect(
                                                            e.target.value,
                                                            "no_of_options_blocks",
                                                            sectionIdx,
                                                            index
                                                          )
                                                        }
                                                        value={
                                                          getQuestionValues(
                                                            sectionIdx,
                                                            index
                                                          )?.questions_config
                                                            .no_of_options
                                                        }
                                                        type="number"
                                                        min={1}
                                                        max={10}
                                                        placeholder="Enter No of Options Blocks"
                                                      />
                                                    </div>
                                                  </div>
                                                ))}
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        {/* Passage */}
                                        <div className="bg-amber-50 rounded p-3 my-2">
                                          <Label>Passage</Label>
                                          <Editor
                                            filedName="question"
                                            id={
                                              section.uuid +
                                              "-question-" +
                                              index
                                            }
                                            placeholder="Enter Question Here..."
                                            onChange={(value) =>
                                              console.log(value)
                                            }
                                          />
                                        </div>
                                        {/* Question */}
                                        <div className="bg-emerald-50 rounded p-3 my-2">
                                          <Label>Question</Label>
                                          <Editor
                                            filedName="question"
                                            id={
                                              section.uuid +
                                              "-question-" +
                                              index
                                            }
                                            placeholder="Enter Question Here..."
                                            onChange={(value) =>
                                              console.log(value)
                                            }
                                          />
                                        </div>
                                        {/* Options */}
                                        <div className="bg-indigo-50 rounded p-3 my-2">
                                          <Label>Options</Label>
                                          <Editor
                                            filedName="question"
                                            id={
                                              section.uuid +
                                              "-question-" +
                                              index
                                            }
                                            placeholder="Enter Option 1 here"
                                            onChange={(value) =>
                                              console.log(value)
                                            }
                                          />
                                          <Editor
                                            filedName="question"
                                            id={
                                              section.uuid +
                                              "-question-" +
                                              index
                                            }
                                            placeholder="Enter Option 1 here"
                                            onChange={(value) =>
                                              console.log(value)
                                            }
                                          />
                                          <Editor
                                            filedName="question"
                                            id={
                                              section.uuid +
                                              "-question-" +
                                              index
                                            }
                                            placeholder="Enter Option 1 here"
                                            onChange={(value) =>
                                              console.log(value)
                                            }
                                          />
                                        </div>
                                        {/* Answers */}
                                        <div className="bg-pink-50 rounded p-3 my-2">
                                          <Label>Answers</Label>
                                          <div className="flex justify-start gap-2">
                                            <div className="flex justify-start items-center space-x-1">
                                              <Checkbox id="answer-1" />
                                              <label
                                                htmlFor="answer-1"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                1
                                              </label>
                                            </div>
                                            <div className="flex justify-start items-center space-x-1">
                                              <Checkbox id="answer-2" />
                                              <label
                                                htmlFor="answer-2"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                2
                                              </label>
                                            </div>
                                            <div className="flex justify-start items-center space-x-1">
                                              <Checkbox id="answer-3" />
                                              <label
                                                htmlFor="answer-3"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                3
                                              </label>
                                            </div>
                                            <div className="flex justify-start items-center space-x-1">
                                              <Checkbox id="answer-4" />
                                              <label
                                                htmlFor="answer-4"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                              >
                                                4
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                )
                              )}
                            </Accordion>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  )}
              </div>
              <SheetFooter>
                <div className="flex justify-between items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    className="border-sky-400"
                    onClick={createQuestionSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default CreateTest;

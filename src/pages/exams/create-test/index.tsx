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
import { IQuestionsConfig } from "./types";
import QuestionConfig from "./__comps/create-questions/question-config";
import OptionsList from "./__comps/create-questions/options-list";
import AnswersList from "./__comps/create-questions/answers";

interface ITestData {
  pattren: string;
  testTitle: string;
  sections: ISection[];
}

interface IQuestions {
  questions_config: IQuestionsConfig;
  question: string;
  passage: string;
  nonBlanks: {
    options: TOptions[];
    answer: number[];
  };
  blanks: {
    answer: TOptions[][];
    options: TOptions[][];
  };
}

type TOptions = string;

interface ISection {
  questions: IQuestions[];
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
              blank_options: 0,
            },
            question: "",
            passage: "",
            nonBlanks: {
              options: [],
              answer: [],
            },
            blanks: {
              answer: [],
              options: [],
            },
          },
        ],
      },
    ],
  };

  const [listOfExamsPattrens, setListOfExamsPattrens] = useState<any[]>([]);
  const [listOfSections, setListSections] = useState<any[]>([]);

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
                blank_options: 0,
              },
              question: "",
              passage: "",
              blanks: {
                answer: [],
                options: [],
              },
              nonBlanks: {
                answer: [],
                options: [],
              },
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
  /* End of API Handlers */

  /* Utils */

  const getQuestionValues = (sectionIdx: number, questionIdx: number) => {
    return testData?.sections[sectionIdx]?.questions[questionIdx];
  };

  type TShowHideCases = "question";

  const showHide = (
    sectionIndex: number,
    questionIndex: number,
    value: TShowHideCases
  ): boolean => {
    switch (value) {
      case "question":
        return (
          getQuestionValues(sectionIndex, questionIndex).questions_config
            .question_type === "type2" ||
          (getQuestionValues(sectionIndex, questionIndex).questions_config
            .question_type === "type1" &&
            getQuestionValues(sectionIndex, questionIndex).questions_config
              .isThisPassageHaveQuestion === "yes")
        );
      default:
        return false;
    }
  };

  /* End of Utils */

  /* Input Handlers */
  const setQuestionConfigs = (si: number, qi: number, key: any, val: any) => {
    setTestData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, secIndx) => ({
        questions: section.questions.map((question, qIdx) =>
          secIndx === si && qIdx === qi
            ? {
                ...question,
                [key]: val,
              }
            : question
        ),
      })),
    }));
  };

  const handleAnswerNonBlanksOptions = (
    value: any,
    optionIndex: number,
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
                nonBlanks: {
                  ...question.nonBlanks,
                  options: question.nonBlanks.options.map((option, oIdx) =>
                    oIdx === optionIndex ? value : option
                  ),
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
  const createQuestionSubmit = () => {
    console.log(testData);
  };

  useEffect(() => {
    getExamsPattrens();
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
                                        <QuestionConfig
                                          propData={
                                            getQuestionValues(sectionIdx, index)
                                              .questions_config
                                          }
                                          sendData={(e) =>
                                            setQuestionConfigs(
                                              sectionIdx,
                                              index,
                                              "questions_config",
                                              e
                                            )
                                          }
                                        />

                                        {/* Passage */}
                                        {getQuestionValues(sectionIdx, index)
                                          .questions_config.question_type ===
                                          "type1" && (
                                          <div className="bg-amber-50 rounded p-3 my-2">
                                            <Label>Passage</Label>
                                            <Editor
                                              filedName="passage"
                                              id={
                                                section.uuid +
                                                "-passage-" +
                                                index
                                              }
                                              data={
                                                getQuestionValues(
                                                  sectionIdx,
                                                  index
                                                ).passage
                                              }
                                              placeholder="Enter Passage Here..."
                                              onChange={(value) =>
                                                setQuestionConfigs(
                                                  sectionIdx,
                                                  index,
                                                  "passage",
                                                  value
                                                )
                                              }
                                            />
                                          </div>
                                        )}

                                        {/* Question */}
                                        {showHide(
                                          sectionIdx,
                                          index,
                                          "question"
                                        ) && (
                                          <div className="bg-emerald-50 rounded p-3 my-2">
                                            <Label>Question</Label>
                                            <Editor
                                              filedName="question"
                                              id={
                                                section.uuid +
                                                "-question-" +
                                                index
                                              }
                                              data={
                                                getQuestionValues(
                                                  sectionIdx,
                                                  index
                                                ).question
                                              }
                                              placeholder="Enter Question Here..."
                                              onChange={(value) =>
                                                setQuestionConfigs(
                                                  sectionIdx,
                                                  index,
                                                  "question",
                                                  value
                                                )
                                              }
                                            />
                                          </div>
                                        )}

                                        {/* Options */}
                                        {getQuestionValues(sectionIdx, index)
                                          .questions_config.no_of_options >
                                          0 && (
                                          <div className="bg-indigo-50 rounded p-3 my-2">
                                            <Label>Options</Label>
                                            <OptionsList
                                              noOfOptions={
                                                getQuestionValues(
                                                  sectionIdx,
                                                  index
                                                ).questions_config.no_of_options
                                              }
                                              getData={
                                                getQuestionValues(
                                                  sectionIdx,
                                                  index
                                                ).nonBlanks.options
                                              }
                                              sendData={(options) =>
                                                setTestData((prev) => ({
                                                  ...prev,
                                                  sections: prev.sections.map(
                                                    (section, secIndx) => ({
                                                      questions:
                                                        section.questions.map(
                                                          (question, qIdx) =>
                                                            secIndx ===
                                                              sectionIdx &&
                                                            qIdx === index
                                                              ? {
                                                                  ...question,
                                                                  nonBlanks: {
                                                                    ...question.nonBlanks,
                                                                    options,
                                                                  },
                                                                }
                                                              : question
                                                        ),
                                                    })
                                                  ),
                                                }))
                                              }
                                            />
                                          </div>
                                        )}

                                        {/* Answers */}
                                        {showHide(
                                          sectionIdx,
                                          index,
                                          "question"
                                        ) && (
                                          <div className="bg-pink-50 rounded p-3 my-2">
                                            <Label>Answers</Label>
                                            <AnswersList
                                              noOfOptions={
                                                getQuestionValues(
                                                  sectionIdx,
                                                  index
                                                ).questions_config.no_of_options
                                              }
                                              getData={
                                                getQuestionValues(
                                                  sectionIdx,
                                                  index
                                                ).nonBlanks.answer
                                              }
                                              sendData={(options) =>
                                                setTestData((prev) => ({
                                                  ...prev,
                                                  sections: prev.sections.map(
                                                    (section, secIndx) => ({
                                                      questions:
                                                        section.questions.map(
                                                          (question, qIdx) =>
                                                            secIndx ===
                                                              sectionIdx &&
                                                            qIdx === index
                                                              ? {
                                                                  ...question,
                                                                  nonBlanks: {
                                                                    ...question.nonBlanks,
                                                                    answer:
                                                                      options,
                                                                  },
                                                                }
                                                              : question
                                                        ),
                                                    })
                                                  ),
                                                }))
                                              }
                                            />
                                          </div>
                                        )}
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

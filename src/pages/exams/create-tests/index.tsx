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
import { IconArrowBack, IconPlus } from "@tabler/icons-react";
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
import QuestionConfig from "../create-tests/__comps/create-questions/question-config";
import NonBlankBlock from "../create-tests/__comps/create-questions/nonBlanks";
import BlanksBlock from "../create-tests/__comps/create-questions/blanks";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/use-toast";
import { INonBlankBlock, IQuestionsConfig } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ITestData {
  pattren: string;
  testTitle: string;
  sections: ISection[];
}

interface IQuestions {
  section_uuid: string;
  questions_config: IQuestionsConfig;
  question: string;
  passage: string;
  explination: string;
  nonBlanks: INonBlankBlock;
  blanks: INonBlankBlock[];
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
            section_uuid: "",
            questions_config: {
              question_type: "",
              mode: "",
              isThisPassageHaveQuestion: "",
              no_of_options: 0,
              isThereBlanks: false,
              no_of_blanks: 0,
              isThereHeaderInfo: false,
              header_info: "",
              isThereFooterInfo: false,
              footer_info: "",
              blank_options: [],
            },
            question: "",
            passage: "",
            explination: "",
            nonBlanks: {
              options: [],
              answer: [],
            },
            blanks: [],
          },
        ],
      },
    ],
  };

  const { toast } = useToast();

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
              section_uuid: item.uuid,
              questions_config: {
                question_type: "",
                mode: "",
                isThisPassageHaveQuestion: "",
                no_of_options: 0,
                isThereBlanks: false,
                no_of_blanks: 0,
                isThereHeaderInfo: false,
                header_info: "",
                isThereFooterInfo: false,
                footer_info: "",
                blank_options: [],
              },
              question: "",
              passage: "",
              explination: "",
              nonBlanks: {
                options: [],
                answer: [],
              },
              blanks: [],
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
  const takeABreak = () => {
    if (testData.pattren === "") {
      toast({
        variant: "destructive",
        title: "Please select exam pattren!",
      });
    } else if (testData.testTitle === "") {
      toast({
        variant: "destructive",
        title: "Please enter test title!",
      });
    } else {
      Swal.fire({
        title: "Are you sure you want to take a break?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
    // if(confirm("Are you sure you want to take a break?")) {
    // }
  };

  useEffect(() => {
    getExamsPattrens();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Create Test"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Link to="/tests/test-factory">
            <Button variant="outline">
              Back <IconArrowBack size={14} />
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardContent>
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
                        <TabsTrigger key={section.uuid} value={section.uuid}>
                          {section.section_name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {listOfSections.map((section, sectionIdx) => (
                      <TabsContent
                        key={section.uuid}
                        value={section.uuid}
                        className="overflow-auto"
                        defaultValue={listOfSections[0].uuid + "-question-0"}
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
                                            section.uuid + "-passage-" + index
                                          }
                                          data={
                                            getQuestionValues(sectionIdx, index)
                                              .passage
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
                                            section.uuid + "-question-" + index
                                          }
                                          data={
                                            getQuestionValues(sectionIdx, index)
                                              .question
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

                                    {/* Explination */}
                                    <div className="bg-orange-50 rounded p-3 my-2">
                                      <Label>Explanation</Label>
                                      <Editor
                                        filedName="explination"
                                        id={
                                          section.uuid + "-explination-" + index
                                        }
                                        data={
                                          getQuestionValues(sectionIdx, index)
                                            .explination
                                        }
                                        placeholder="Enter Explination Here..."
                                        onChange={(value) =>
                                          setQuestionConfigs(
                                            sectionIdx,
                                            index,
                                            "explination",
                                            value
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Non Blanks */}
                                    {getQuestionValues(sectionIdx, index)
                                      .questions_config.no_of_options > 0 && (
                                      <NonBlankBlock
                                        noOfOptions={
                                          getQuestionValues(sectionIdx, index)
                                            .questions_config.no_of_options
                                        }
                                        getData={
                                          getQuestionValues(sectionIdx, index)
                                            .nonBlanks
                                        }
                                        sendData={(options) =>
                                          setTestData((prev) => ({
                                            ...prev,
                                            sections: prev.sections.map(
                                              (section, secIndx) => ({
                                                questions:
                                                  section.questions.map(
                                                    (question, qIdx) =>
                                                      secIndx === sectionIdx &&
                                                      qIdx === index
                                                        ? {
                                                            ...question,
                                                            nonBlanks: options,
                                                          }
                                                        : question
                                                  ),
                                              })
                                            ),
                                          }))
                                        }
                                      />
                                    )}

                                    {/* Blanks */}
                                    <BlanksBlock
                                      blank_options={
                                        getQuestionValues(sectionIdx, index)
                                          .questions_config.blank_options
                                      }
                                      getData={
                                        getQuestionValues(sectionIdx, index)
                                          .blanks
                                      }
                                      sendData={(options) => {
                                        setTestData((prev) => ({
                                          ...prev,
                                          sections: prev.sections.map(
                                            (section, secIndx) => ({
                                              questions: section.questions.map(
                                                (question, qIdx) =>
                                                  secIndx === sectionIdx &&
                                                  qIdx === index
                                                    ? {
                                                        ...question,
                                                        blanks: options,
                                                      }
                                                    : question
                                              ),
                                            })
                                          ),
                                        }));
                                      }}
                                    />
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

            <div className="mt-3 flex justify-between items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
              <Button
                variant="outline"
                className="border-orange-400"
                onClick={takeABreak}
              >
                Take a Break
              </Button>
              <Button
                variant="outline"
                className="border-sky-400"
                onClick={createQuestionSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CreateTest;

import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
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
import QuestionConfig from "./__comps/create-questions/question-config";
import NonBlankBlock from "./__comps/create-questions/nonBlanks";
import BlanksBlock from "./__comps/create-questions/blanks";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/use-toast";
import { INonBlankBlock, IQuestionsConfig } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ITestData {
  pattren: string;
  testTitle: string;
  status?: number;

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

const UpdateTests = () => {
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
  const navigate = useNavigate();
  const [examStatus, setExamStatus] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [listOfExamsPattrens, setListOfExamsPattrens] = useState<any[]>([]);
  const [listOfSections, setListSections] = useState<any[]>([]);
  const [formSubmit, setFormSubmit] = useState<boolean>(false);
  const [testData, setTestData] = useState<ITestData>(_initalTestData);
  const { testId } = useParams();
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
  const handleSlectValue = (value: string) => {
    getSectionsData(Number(value));
    setTestData((prev) => ({ ...prev, pattren: value }));
  };
  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTestData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const formErroMsg = (msg: string) => {
    toast({
      variant: "destructive",
      title: msg,
    });
    setFormSubmit(false);
    return false;
  };
  const getDataFromTestsScreens = async () => {
    try {
      const res = await api.post("/getTestByUuid", {
        uuid: testId,
      });
      const { status, data } = res;
      if (status === 200) {
        getSectionsData(Number(data.data.pattren));
        setTestData(data.data);
        setExamStatus(data.data.status);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };
  /* End Input Handlers  */
  const createQuestionSubmit = async () => {
    setFormSubmit(true);
    if (testData.pattren === "") {
      formErroMsg("Please select exam pattren!");
    } else if (testData.testTitle === "") {
      formErroMsg("Please enter test title!");
    } else {
      for (let i = 0; i < testData.sections.length; i++) {
        for (let j = 0; j < testData.sections[i].questions.length; j++) {
          const locData = testData.sections[i].questions[j];
          if (locData.questions_config.question_type === "") {
            return formErroMsg(
              `Please select question type for question ${j + 1} in section ${i + 1}`
            );
          } else if (locData.questions_config.mode === "") {
            return formErroMsg(
              `Please select question mode for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.question_type === "type1" &&
            locData.questions_config.isThisPassageHaveQuestion === ""
          ) {
            return formErroMsg(
              `Please select is this passage have question for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.question_type === "type2" &&
            locData.questions_config.isThereBlanks === true &&
            locData.questions_config.no_of_blanks === 0
          ) {
            return formErroMsg(
              `Please enter number of blanks for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.no_of_blanks > 0 &&
            locData.questions_config.blank_options.some((item) => item === 0)
          ) {
            return formErroMsg(
              `Please enter no:of options there in the blanks options for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.isThereHeaderInfo === true &&
            testData.sections[i].questions[
              j
            ].questions_config.header_info.trim().length < 1
          ) {
            return formErroMsg(
              `Please enter header info for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.isThereFooterInfo === true &&
            testData.sections[i].questions[
              j
            ].questions_config.footer_info.trim().length < 1
          ) {
            return formErroMsg(
              `Please enter footer info for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            (locData.questions_config.isThisPassageHaveQuestion === "yes" &&
              locData.questions_config.no_of_options === 0) ||
            (locData.questions_config.question_type === "type2" &&
              locData.questions_config.isThereBlanks === false &&
              locData.questions_config.no_of_options === 0)
          ) {
            return formErroMsg(
              `Please enter number of options for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.question_type === "type1" &&
            locData.passage.trim().length === 0
          ) {
            return formErroMsg(
              `Please enter passage for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.isThisPassageHaveQuestion !== "no" &&
            locData.question === ""
          ) {
            return formErroMsg(
              `Please enter question for question ${j + 1} in section ${i + 1}`
            );
          } else if (locData.explination === "") {
            return formErroMsg(
              `Please enter explination for question ${j + 1} in section ${
                i + 1
              }`
            );
          } else if (
            ((locData.questions_config.question_type === "type1" &&
              locData.questions_config.isThisPassageHaveQuestion === "yes") ||
              (locData.questions_config.question_type === "type2" &&
                locData.questions_config.isThereBlanks === false)) &&
            locData.nonBlanks.options.some((item) => item.trim().length === 0)
          ) {
            return formErroMsg(
              `Please enter all options for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            ((locData.questions_config.question_type === "type1" &&
              locData.questions_config.isThisPassageHaveQuestion === "yes") ||
              (locData.questions_config.question_type === "type2" &&
                locData.questions_config.isThereBlanks === false)) &&
            locData.nonBlanks.answer.length === 0
          ) {
            return formErroMsg(
              `Please select answer for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.isThereBlanks === true &&
            locData.blanks.every((item) =>
              item.options.some((opt) => opt.length === 0)
            )
          ) {
            return formErroMsg(
              `Please enter all blanks options for question ${j + 1} in section ${i + 1}`
            );
          } else if (
            locData.questions_config.isThereBlanks === true &&
            locData.blanks.some((item) => item.answer.length === 0)
          ) {
            return formErroMsg(
              `Please select atleast 1 answer in each blank options for question ${j + 1} in section ${i + 1}`
            );
          }
        }
      }
      {
        const payload = {
          ...testData,
          status: examStatus === 2 ? 1 : examStatus,
        };
        try {
          const a = await api.put(`/mock-test/${testId}`, payload);
          const { status } = a;
          if (status === 201) {
            Swal.fire("Practice Test Updated!", "", "success").then(() => {
              navigate("/tests/test-factory");
            });
          }
        } catch (e) {
          console.error(e);
          Swal.fire("Something went wrong!", "", "error");
          setFormSubmit(false);
        }
      }
    }
  };
  const takeABreak = () => {
    setFormSubmit(true);
    if (testData.pattren === "") {
      formErroMsg("Please select exam pattren!");
    } else if (testData.testTitle === "") {
      formErroMsg("Please enter test title!");
    } else {
      Swal.fire({
        title: "Are you sure you want to take a break?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          (async () => {
            try {
              const payload = {
                ...testData,
                status: 2,
              };
              const a = await api.put(`/mock-test/${testId}`, payload);
              const { status } = a;
              if (status === 201) {
                Swal.fire("Test Saved to DB!", "", "success").then(() => {});
                navigate("/tests/test-factory");
              }
            } catch (e) {
              console.error(e);
              Swal.fire("Something went wrong!", "", "error");
              setFormSubmit(false);
            }
          })();
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
          setFormSubmit(false);
        }
      });
    }
  };

  useEffect(() => {
    getExamsPattrens();
    getDataFromTestsScreens();
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
      {!loading && (
        <Card>
          <CardContent>
            <div className="p-4">
              {testData?.status !== undefined && testData?.status !== 2 && (
                <div className="border p-3 rounded-lg">
                  <Label>Test Status</Label>
                  <RadioGroup
                    onValueChange={(value) => setExamStatus(Number(value))}
                    defaultValue={testData?.status?.toString()}
                    className="flex gap-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="1"
                        id="option-active"
                        className="text-green-700"
                      />
                      <Label htmlFor="option-active" className="text-green-700">
                        Active
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="0"
                        id="option-inActive"
                        className="text-red-700"
                      />
                      <Label htmlFor="option-inActive" className="text-red-700">
                        In Active
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              <div className="my-3 flex gap-2">
                <div>
                  <Label>Exam Pattren</Label>
                  {testData?.status === 2 && (
                    <Select
                      onValueChange={handleSlectValue}
                      defaultValue={testData?.pattren}
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
                  )}
                  {testData?.status !== 2 && (
                    <>
                      <p className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        {
                          listOfExamsPattrens.filter(
                            (res) => res.id === testData?.pattren
                          )[0]?.name
                        }
                      </p>
                      <div className="text-xs text-gray-500">
                        Note: You can't change the exam pattren after submitting
                        the test.
                      </div>
                    </>
                  )}
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
                                            ?.questions_config
                                        }
                                        sendData={(e) =>
                                          setQuestionConfigs(
                                            sectionIdx,
                                            index,
                                            "questions_config",
                                            e
                                          )
                                        }
                                        status={testData?.status}
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

                                      {/* Explination */}
                                      <div className="bg-orange-50 rounded p-3 my-2">
                                        <Label>Explanation</Label>
                                        <Editor
                                          filedName="explination"
                                          id={
                                            section.uuid +
                                            "-explination-" +
                                            index
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
                                                        secIndx ===
                                                          sectionIdx &&
                                                        qIdx === index
                                                          ? {
                                                              ...question,
                                                              nonBlanks:
                                                                options,
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
                                                questions:
                                                  section.questions.map(
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

              <div className="mt-3 flex justify-end gap-2 items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                {!formSubmit && (
                  <>
                    {testData?.status !== 1 && (
                      <Button
                        disabled={formSubmit}
                        variant="outline"
                        className="border-orange-400"
                        onClick={takeABreak}
                      >
                        Take a Break
                      </Button>
                    )}

                    <Button
                      disabled={formSubmit}
                      variant="outline"
                      className="border-sky-400"
                      onClick={createQuestionSubmit}
                    >
                      Update
                    </Button>
                  </>
                )}
                {formSubmit && (
                  <Button variant="outline" className="border-sky-400">
                    loading...
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {loading && <Alert>Loading.....</Alert>}
    </>
  );
};

export default UpdateTests;

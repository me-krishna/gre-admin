import { Fragment, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconEdit, IconTrash, IconEye, IconPlus } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardTitle } from "@/components/ui/card";
import TableLoader from "@/components/table-loader";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/page-title";
import api from "@/api/api";
import DrRajusPagination from "@/components/pagination";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { set } from "date-fns";
import { get } from "http";

type IAction = "view" | "edit";

interface IMockTest {
  name: string;
  no_sections: number;
  sections: ISectionTypes[];
}

interface ISectionTypes {
  section_topic: string;
  section_duration: number | "";
  no_of_questions: number | "";
}

const MockTest = () => {
  const inititialBtn = {
    submit: false,
    text: "Submit",
  };
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const [createButton, setCreateButton] = useState(inititialBtn);
  const [topicsList, setTopicsList] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [mockTestCreate, setMockTestCreate] = useState<IMockTest>({
    name: "",
    no_sections: 1,
    sections: [
      {
        section_topic: "",
        section_duration: "",
        no_of_questions: "",
      },
    ],
  });

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPage: 15,
    total: 0,
    totalPages: 0,
  });

  const getCurrentPage = (page: number) => {
    setPaginationData((prev) => {
      return {
        ...prev,
        currentPage: page,
      };
    });
  };

  /* Backend Intractions */

  const getTopicsData = async () => {
    try {
      const { data, status, ...res } = await api.get("/topics/0");
      if (status === 200 && data.data && data.data.length > 0) {
        setTopicsList(data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const submitTheCreateTest = async () => {
    try {
      const { data, status, ...res } = await api.post("/exam", mockTestCreate);
      if (status === 201) {
        seccessMsg("Mock Test Created Successfully");
        actionBtnRef.current?.click();
        setMockTestCreate({
          name: "",
          no_sections: 1,
          sections: [
            {
              section_topic: "",
              section_duration: "",
              no_of_questions: "",
            },
          ],
        });
        if (paginationData.currentPage !== 1) {
          setPaginationData((prev) => ({
            ...prev,
            currentPage: 1,
          }));
        } else {
          getAllExams();
        }
      } else {
        errorMsg("Failed to Create the Mock Test");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCreateButton(inititialBtn);
    }
  };

  const getAllExams = async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationData.currentPage,
        limit: paginationData.perPage,
      };
      const { data, status, ...res } = await api.get("/exam", { params });
      if (status === 200) {
        setData(data.data);
        setPaginationData((prev) => {
          return {
            ...prev,
            total: data.metadata.pagination.total_records,
            totalPages: data.metadata.pagination.total_pages,
          };
        });
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  /* End of Backend Intractions */

  /*  Input Handlders */

  const singleInputHander = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevSectionLength = mockTestCreate.sections.length;
    const { value, name } = e.target;
    if (name === "no_sections" && parseInt(value) < 1) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No of sections should be greater than 0",
      });
      return false;
    }

    if (name === "no_sections" && parseInt(value) > 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No of sections should not exceed 10",
      });
      return false;
    }

    setMockTestCreate((prev: any) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    if (name === "no_sections") {
      if (prevSectionLength < parseInt(value)) {
        const diff = parseInt(value) - prevSectionLength;
        for (let i = 0; i < diff; i++) {
          setMockTestCreate((prev: any) => {
            return {
              ...prev,
              sections: [
                ...prev.sections,
                {
                  section_topic: "",
                  section_duration: "",
                  no_of_questions: "",
                },
              ],
            };
          });
        }
      } else {
        const diff = prevSectionLength - parseInt(value);
        for (let i = 0; i < diff; i++) {
          setMockTestCreate((prev: any) => {
            return {
              ...prev,
              sections: prev.sections.slice(0, prev.sections.length - 1),
            };
          });
        }
      }
    }
  };

  const sessionInputHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { name, value } = e.target;
    const sectionIndex = idx;
    setMockTestCreate((prev: any) => {
      return {
        ...prev,
        sections: prev.sections.map((data: ISectionTypes, i: number) => {
          if (i === sectionIndex) {
            return {
              ...data,
              [name]: value,
            };
          }
          return data;
        }),
      };
    });
  };

  const onChangeValue = (value: any, idx: number) => {
    setMockTestCreate((prev: any) => {
      return {
        ...prev,
        sections: prev.sections.map((data: ISectionTypes, i: number) => {
          if (i === idx) {
            return {
              ...data,
              section_topic: value,
            };
          }
          return data;
        }),
      };
    });
  };

  /* End of Input Handlers */

  /* Error Handlers */

  const seccessMsg = (msg?: string) => {
    toast({
      variant: "default",
      title: "Success",
      description: msg,
    });
    setCreateButton(inititialBtn);
  };

  const errorMsg = (msg?: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: msg,
    });
    setCreateButton(inititialBtn);
  };

  /* End of Error Handlers */

  const createTest = async () => {
    setCreateButton({
      submit: true,
      text: "Submitting...",
    });
    if (mockTestCreate.name === "") {
      errorMsg("Please Enter the Exam Name");
      return false;
    } else if (mockTestCreate.no_sections === 0) {
      errorMsg("Please Enter the Number of Sections");
      return false;
    } else if (mockTestCreate.sections.length === 0) {
      errorMsg("Please Enter the Sections");
      return false;
    } else if (
      mockTestCreate.sections.some((data) => data.section_topic === "")
    ) {
      errorMsg("Please Select the Topic for all the Sections");
      return false;
    } else if (
      mockTestCreate.sections.some((data) => data.section_duration === "")
    ) {
      errorMsg("Please Enter the Duration for all the Sections");
      return false;
    } else if (
      mockTestCreate.sections.some((data) => data.no_of_questions === "")
    ) {
      errorMsg("Please Enter the No:Of Questions for all the Sections");
      return false;
    } else {
      await submitTheCreateTest();
    }
  };

  useEffect(() => {
    getAllExams();
  }, [paginationData.currentPage]);

  useEffect(() => {
    getTopicsData();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Test patterns"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button ref={actionBtnRef} variant="outline">
                Create <IconPlus size={14} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80%] sm:max-w-[940px] overflow-auto">
              <SheetHeader>
                <SheetTitle>Create Test Pattren</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-12 gap-4 py-4">
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                  <Label htmlFor="ExamName">Exam Name</Label>
                  <Input
                    id="ExamName"
                    placeholder="Enter Exam Name"
                    type="text"
                    name="name"
                    value={mockTestCreate.name}
                    onChange={singleInputHander}
                  />
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                  <Label htmlFor="howManySections">How Many Sections ?</Label>
                  <Input
                    id="howManySections"
                    type="number"
                    min={1}
                    max={10}
                    name="no_sections"
                    value={mockTestCreate.no_sections}
                    onChange={singleInputHander}
                  />
                </div>
              </div>
              <>
                {mockTestCreate.sections.map((data, i) => (
                  <div
                    className="p-3 border rounded-md my-2 shadow shadow-gray-200 dark:shadow-gray-800 "
                    key={`section-${i}`}
                  >
                    <h2>Section {i + 1}</h2>
                    <div className="grid grid-cols-12 gap-4 py-4">
                      <div className="col-span-12 sm:col-span-6 md:col-span-4">
                        <Label htmlFor="howManySections">Topic</Label>
                        <Select
                          onValueChange={(e) => onChangeValue(e, i)}
                          defaultValue={data.section_topic}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Topic" />
                          </SelectTrigger>
                          <SelectContent>
                            {topicsList.length > 0 &&
                              topicsList.map((topic) => (
                                <SelectItem
                                  key={`${topic?.name}-${topic.created_at}`}
                                  value={topic.id}
                                >
                                  {topic?.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-12 sm:col-span-6 md:col-span-4">
                        <Label htmlFor="howManySections">Duration</Label>
                        <Input
                          type="number"
                          name="section_duration"
                          placeholder="Duration in Minutes"
                          value={data.section_duration}
                          onChange={(e) => sessionInputHandler(e, i)}
                        />
                      </div>
                      <div className="col-span-12 sm:col-span-6 md:col-span-4">
                        <Label htmlFor="howManySections">
                          No : Of Questions
                        </Label>
                        <Input
                          name="no_of_questions"
                          placeholder="No:Of Questions"
                          type="number"
                          value={data.no_of_questions}
                          onChange={(e) => sessionInputHandler(e, i)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
              <SheetFooter>
                {!createButton.submit && (
                  <Button variant="default" onClick={createTest}>
                    Submit
                  </Button>
                )}
                {createButton.submit && (
                  <Button variant="ghost" disabled>
                    {createButton.text}
                  </Button>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {!loading && data?.length > 0 && (
        <Card>
          <CardTitle className="flex justify-between items-center p-3">
            <Badge className="bg-purple-700 dark:text-slate-100">
              Total Records : {paginationData.total}
            </Badge>
            <Badge className="bg-indigo-700 dark:text-slate-100">
              Total Pages : {paginationData.totalPages}
            </Badge>
          </CardTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">No Of Sections</TableHead>
                <TableHead className="text-center">Total Duration</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((res, i) => (
                <TableRow key={uuidv4()}>
                  <TableCell className="font-medium">
                    {(paginationData.currentPage - 1) * data.length + i + 1}
                  </TableCell>
                  <TableCell>{res.name}</TableCell>
                  <TableCell className="text-center">
                    {res.no_sections}
                  </TableCell>
                  <TableCell className="text-center">
                    {`${Math.floor(res.total_duration / 60)} Hour${Math.floor(res.total_duration / 60) > 1 ? "s" : ""} and ${res.total_duration % 60} Minutes`}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className="cursor-pointer mx-1"
                      variant="outline"
                    >
                      <IconEye size={18} />
                    </Badge>
                    <Badge
                      className="cursor-pointer mx-1"
                      variant="default"
                    >
                      <IconEdit size={18} />
                    </Badge>
                    <Badge
                      className="cursor-pointer"
                      variant="destructive"
                    >
                      <IconTrash size={18} />
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DrRajusPagination
            perPage={paginationData.perPage}
            totalRecords={paginationData.total}
            currentPage={paginationData.currentPage}
            setCurrentPage={getCurrentPage}
          />
        </Card>
      )}
      {loading && <TableLoader />}
      {!loading && data?.length < 1 && (
        <Alert>
          <AlertTitle>No Data Found</AlertTitle>
        </Alert>
      )}
    </>
  );
};

export default MockTest;

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
import { parse } from "path";
import { toast } from "@/components/ui/use-toast";

type IAction = "view" | "edit";

interface IMockTest {
  no_of_sections: number;
  sections: ISectionTypes[];
}

interface ISectionTypes {
  topic: string | "";
  duration: number | "";
  no_of_questions: number | "";
}

const MockTest = () => {
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const [action, setAction] = useState<IAction>("view");
  const [mockTestData, setMockTestData] = useState<any[]>([]);
  const [questionData, setQuestionData] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [mockTestCreate, setMockTestCreate] = useState<IMockTest>({
    no_of_sections: 1,
    sections: [
      {
        topic: "",
        duration: "",
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

  const getQestionData = async () => {
    const params = {
      page: paginationData.currentPage,
      limit: paginationData.perPage,
    };
    try {
      const { data, status, ...res } = await api.get("/questions", { params });

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

  const questionActions = (data: any, type: IAction) => {
    setAction(type);
    setQuestionData(data);
    actionBtnRef.current?.click();
  };

  const deleteQuestion = (id: string) => {
    console.log(id);
  };

  /*  Input Handlders */

  const singleInputHander = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevSectionLength = mockTestCreate.sections.length;
    const { value } = e.target;
    setMockTestCreate((prev: any) => {
      return {
        ...prev,
        no_of_sections: value,
      };
    });
    if (prevSectionLength < parseInt(value)) {
      const diff = parseInt(value) - prevSectionLength;
      for (let i = 0; i < diff; i++) {
        setMockTestCreate((prev: any) => {
          return {
            ...prev,
            sections: [
              ...prev.sections,
              {
                topic: "",
                duration: "",
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
  };

  const sesstionsInputHandler = (
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
              topic: value,
            };
          }
          return data;
        }),
      };
    });
  };

  /* End of Input Handlers */

  /* Error Handlers */

  const seccessMsg  = (msg?:string)=>{
    
  }

  /* End of Error Handlers */

  const createTest = () => {
    console.log(mockTestCreate);
  };

  useEffect(() => {}, [paginationData.currentPage]);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Mock Tests"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                Create <IconPlus size={14} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80%] sm:max-w-[940px]">
              <SheetHeader>
                <SheetTitle>Create Mock Test</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-12 gap-4 py-4">
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
                  <Label htmlFor="howManySections">How Many Sections ?</Label>
                  <Input
                    id="howManySections"
                    type="number"
                    name="no_of_sections"
                    value={mockTestCreate.no_of_sections}
                    onChange={singleInputHander}
                  />
                </div>
              </div>
              <>
                {mockTestCreate.sections.map((data, i) => (
                  <div className="p-2 border rounded-md my-1" key={uuidv4()}>
                    <h2>Section {i + 1}</h2>
                    <div
                      key={uuidv4()}
                      className="grid grid-cols-12 gap-4 py-4"
                    >
                      <div
                        key={uuidv4()}
                        className="col-span-12 sm:col-span-6 md:col-span-4"
                      >
                        <Label key={uuidv4()} htmlFor="howManySections">
                          Topic
                        </Label>
                        <Select
                          key={uuidv4()}
                          onValueChange={(e) => onChangeValue(e, i)}
                          defaultValue={data.topic}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Topic 1</SelectItem>
                            <SelectItem value="2">Topic 2</SelectItem>
                            <SelectItem value="3">Topic 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div
                        key={uuidv4()}
                        className="col-span-12 sm:col-span-6 md:col-span-4"
                      >
                        <Label key={uuidv4()} htmlFor="howManySections">
                          Duration
                        </Label>
                        <Input
                          key={uuidv4()}
                          placeholder="Section Duration"
                          type="number"
                          name="duration"
                          onChange={(e) => sesstionsInputHandler(e, i)}
                          value={data.duration}
                        />
                      </div>
                      <div
                        key={uuidv4()}
                        className="col-span-12 sm:col-span-6 md:col-span-4"
                      >
                        <Label key={uuidv4()} htmlFor="howManySections">
                          No : Of Questions
                        </Label>
                        <Input
                          key={uuidv4()}
                          name="no_of_questions"
                          placeholder="No:Of Questions"
                          type="number"
                          value={data.no_of_questions}
                          onChange={(e) => sesstionsInputHandler(e, i)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
              <SheetFooter>
                <Button variant="default" onClick={createTest}>
                  Create
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {new Array(10).map((i,j)=>{return <h1>{j}{i}</h1>})}
      <h1>1</h1>
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
                <TableHead className="text-center">Mode</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead className="text-center">Question</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((res, i) => (
                <TableRow key={uuidv4()}>
                  <TableCell className="font-medium">
                    {(paginationData.currentPage - 1) * data.length + i + 1}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${res.q_mode === "Easy" ? "bg-green-500 hover:bg-green-600" : res?.q_mode === "Medium" ? "bg-orange-500 hover:bg-orange-600" : "bg-red-500 hover:bg-red-600"} `}
                    >
                      {res.q_mode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        res.q_type === "Qtype1"
                          ? "bg-sky-400 hover:bg-sky-500"
                          : res?.q_type === "Qtype2"
                            ? "bg-rose-400 hover:bg-rose-500"
                            : res?.q_type === "Qtype3"
                              ? "bg-cyan-400 hover:bg-cyan-500"
                              : res?.q_type === "Qtype4"
                                ? "bg-orange-400 hover:bg-orange-500"
                                : res?.q_type === "Qtype5"
                                  ? "bg-blue-400 hover:bg-blue-500"
                                  : res?.q_type === "Qtype6"
                                    ? "bg-indigo-400 hover:bg-indigo-500"
                                    : "bg-violet-400 hover:bg-violet-500"
                      }`}
                    >
                      {res.q_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: res.question.includes("<img")
                          ? res.question.replace(
                              "quesimg/",
                              "https://www.drrajus.com/gretest/quesimg/"
                            )
                          : `<p>${res.question}</p>`,
                      }}
                    ></div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="cursor-pointer mx-1"
                      variant="outline"
                      title="Edit the Student Details"
                      onClick={() => questionActions(res, "view")}
                    >
                      <IconEye size={18} />
                    </Badge>
                    <Badge
                      className="cursor-pointer mx-1"
                      variant="default"
                      title="Edit the Student Details"
                      onClick={() => questionActions(res, "edit")}
                    >
                      <IconEdit size={18} />
                    </Badge>
                    <Badge
                      className="cursor-pointer"
                      variant="destructive"
                      title="Delete the Student Record"
                      onClick={() => deleteQuestion(res.q_id)}
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

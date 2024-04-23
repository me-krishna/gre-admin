import { useEffect, useRef, useState } from "react";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type IAction = "view" | "edit";

const QuestionFactory = () => {
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const [action, setAction] = useState<IAction>("view");
  const [questionData, setQuestionData] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setLoading(true);
    getQestionData();
  }, [paginationData.currentPage]);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Questions Factory"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                Create <IconPlus size={14} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80%] sm:max-w-[940px]">
              <SheetHeader>
                <SheetTitle>Create Question</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">Test</div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button ref={actionBtnRef} variant="outline" className="hidden">
                View Data
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[80%] sm:max-w-[940px]">
              <SheetHeader>
                <SheetTitle className="capitalize">
                  {action} Question
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">Test</div>
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

export default QuestionFactory;

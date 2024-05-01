import PageTitle from "@/components/page-title";
import DrRajusPagination from "@/components/pagination";
import TableLoader from "@/components/table-loader";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

const TestFactory = () => {
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

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Tests Factory"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Link to="/tests/create-test">
            <Button variant="outline">
              Create <IconPlus size={14} />
            </Button>
          </Link>
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
                <TableRow key={v4()}>
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
                    <Button
                      variant="outline"
                      size={"sm"}
                      className="mx-1"
                      onClick={() => console.log("View Clicked")}
                    >
                      <IconEye size={18} />
                    </Button>
                    <Button
                      variant="default"
                      size={"sm"}
                      className="mx-1"
                      onClick={() => {
                        console.log("Edit Clicked");
                      }}
                    >
                      <IconEdit size={18} />
                    </Button>
                    <Button
                      className="mx-1"
                      variant="destructive"
                      size={"sm"}
                      // disabled={}
                      onClick={() => console.log("Delete Clicked")}
                    >
                      <IconTrash size={18} />
                    </Button>
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

export default TestFactory;
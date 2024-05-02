import api from "@/api/api";
import PageTitle from "@/components/page-title";
import DrRajusPagination from "@/components/pagination";
import TableLoader from "@/components/table-loader";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconCircleCheck,
  IconEdit,
  IconEye,
  IconPlus,
  IconProgress,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
const TestFactory = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPage: 10,
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

  const getDataFromDb = async () => {
    setLoading(true);
    try {
      const res = await api.get("/mock-test", {
        params: {
          page: paginationData.currentPage,
          limit: paginationData.perPage,
        },
      });
      const { data, status } = res;
      if (status === 200) {
        setData(data.data);
        console.log(data.data);
        setPaginationData((prev) => {
          return {
            ...prev,
            total: data.metadata.pagination.total_records,
            totalPages: data.metadata.pagination.total_pages,
          };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getDataFromDb();
  }, [paginationData.currentPage]);

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
              Total Records : {paginationData?.total}
            </Badge>
            <Badge className="bg-indigo-700 dark:text-slate-100">
              Total Pages : {paginationData.totalPages}
            </Badge>
          </CardTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S.No</TableHead>
                <TableHead className="text-center">Test Pattren</TableHead>
                <TableHead className="text-center">Test Name</TableHead>
                <TableHead className="text-center">Total Sections</TableHead>
                <TableHead className="text-center">Duration</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((res, i) => (
                <TableRow key={v4()}>
                  <TableCell className="font-medium">
                    {(paginationData.currentPage - 1) * data.length + i + 1}
                  </TableCell>
                  <TableCell>{res?.name}</TableCell>
                  <TableCell className="text-center">{res?.title}</TableCell>
                  <TableCell className="text-center">
                    {res?.no_sections}
                  </TableCell>
                  <TableCell className="text-center">
                    {`${Math.floor(res?.total_duration / 60)} Hour${Math.floor(res?.total_duration / 60) > 1 ? "s" : ""} and ${res?.total_duration % 60} Minutes`}
                  </TableCell>
                  <TableCell className="text-center">
                    {res?.status === 0 && (
                      <span className="py-1  shadow px-3 rounded-full text-[12px] inline-flex gap-2 text-red-600 bg-red-200">
                        In Active <IconX size={18} />
                      </span>
                    )}

                    {res?.status === 1 && (
                      <span className="py-1  shadow px-3 rounded-full text-[12px] inline-flex gap-2 text-green-600 bg-green-200">
                        Active <IconCircleCheck size={18} />
                      </span>
                    )}

                    {res?.status === 2 && (
                      <span className="py-1  shadow px-3 rounded-full text-[12px] inline-flex gap-2 text-orange-400 bg-orange-200">
                        In Progress <IconProgress size={18} />
                      </span>
                    )}
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

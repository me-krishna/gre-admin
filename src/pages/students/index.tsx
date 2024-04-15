import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IconEdit, IconTrash } from "@tabler/icons-react";
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

const Leads = () => {
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

  const getStudentsData = async () => {
    const params = {
      page: paginationData.currentPage,
      limit: paginationData.perPage,
    };
    try {
      const { data, status, ...res } = await api.get("/students", { params });

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

  useEffect(() => {
    setLoading(true);
    getStudentsData();
  }, [paginationData.currentPage]);

  return (
    <>
      <PageTitle title="Students"/>
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
                <TableHead>Email</TableHead>
                <TableHead>Login ID</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((res, i) => (
                <TableRow key={uuidv4()}>
                  <TableCell className="font-medium">{(paginationData.currentPage - 1) * data.length + i + 1}</TableCell>
                  <TableCell>{res.user_full_name}</TableCell>
                  <TableCell>{res.user_email}</TableCell>
                  <TableCell>{res.user_code}</TableCell>
                  <TableCell>{res.user_password}</TableCell>
                  <TableCell>
                    {res.user_active === 1 ? (
                      <Badge className="bg-green-200 text-green-700 hover:bg-green-300 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-200 text-red-700 hover:bg-red-300 dark:bg-red-700 dark:text-red-200 dark:hover:bg-red-800">
                        In Active
                      </Badge>
                    )}{" "}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Badge
                      className="cursor-pointer"
                      variant="default"
                      title="Edit the Student Details"
                    >
                      <IconEdit size={18} />
                    </Badge>
                    <Badge
                      className="cursor-pointer"
                      variant="destructive"
                      title="Delete the Student Record"
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

export default Leads;

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getListOfLeads } from "@/api/leads";
import { Card, CardTitle } from "@/components/ui/card";
import TableLoader from "@/components/table-loader";
import { Alert, AlertTitle } from "@/components/ui/alert";
import MilesPagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";

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

  useEffect(() => {
    setLoading(true);
    getListOfLeads(paginationData.perPage, paginationData.currentPage).then(
      (res: any) => {
        if (res.status === 200) {
          const totalPages = Math.ceil(
            res?.meta.count / paginationData.perPage
          );
          setData(res?.data);
          setPaginationData((prev) => {
            return {
              ...prev,
              total: res?.meta.count,
              totalPages: totalPages,
            };
          });
        }
        setLoading(false);
      }
    );
  }, []);

  return (
    <>
      <div className="flex items-center justify-between md:flex-row flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Leads</h1>
      </div>
      {!loading && data?.length > 0 && (
        <Card>
          <CardTitle className="flex justify-between items-center p-3">
            <Badge>Total Records : {paginationData.total}</Badge>
            <Badge>Total Pages : {paginationData.totalPages}</Badge>
          </CardTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Firm Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((res, i) => (
                <TableRow key={uuidv4()}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>{res.name}</TableCell>
                  <TableCell>{res.firm_name}</TableCell>
                  <TableCell>{res.designation}</TableCell>
                  <TableCell>{res.email}</TableCell>
                  <TableCell>
                    {new Date(res.created_at).toDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <MilesPagination
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

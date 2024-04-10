import { Button } from "@/components/custom/button";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Alert, AlertTitle } from "@/components/ui/alert";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Sheet,
  SheetContent,
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

import { getCampainList, getFromData, getTracking } from "@/api/tracking";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TableLoader from "@/components/table-loader";
import MilesPagination from "@/components/pagination";
import { IconFilter } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";

const UserTracking = () => {
  const initalFilters = {
    campainId: "all",
    formFilled: "all",
  };
  const btnRef = useRef<HTMLButtonElement>(null);
  const filterCloseBtnRef = useRef<HTMLButtonElement>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [campaginList, setCampainList] = useState<any[]>([]);
  const [filterData, setFilterData] = useState<{
    campainId: string;
    formFilled: string;
  }>(initalFilters);

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPage: 15,
    total: 0,
    totalPages: 0,
  });
  const [formFilledData, setFormFilledData] = useState<{
    trackingData: any;
    formData: any;
  }>({
    trackingData: null,
    formData: null,
  });

  const formFilledBtn = (res: any) => {
    setFormFilledData((prev) => {
      return {
        ...prev,
        trackingData: res,
      };
    });
    btnRef.current?.click();
  };

  const filterOnChange = (e: string, name: "campainId" | "formFilled") => {
    currentPageReset();
    setFilterData((prev) => {
      return {
        ...prev,
        [name]: e,
      };
    });
  };

  const getCurrentPage = (page: number) => {
    setPaginationData((prev) => {
      return {
        ...prev,
        currentPage: page,
      };
    });
  };

  const currentPageReset = () => {
    setPaginationData((prev) => {
      return {
        ...prev,
        currentPage: 1,
      };
    });
  };

  const clearAllFilters = () => {
    currentPageReset();
    setFilterData(initalFilters);
    filterCloseBtnRef.current?.click();
  };
  useEffect(() => {
    setLoading(true);
    getTracking(
      paginationData.perPage,
      paginationData.currentPage,
      filterData
    ).then((res: any) => {
      if (res.status === 200) {
        const totalPages = Math.ceil(res?.meta.count / paginationData.perPage);
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
    });
  }, [paginationData.currentPage, paginationData.perPage, filterData]);

  useEffect(() => {
    formFilledData.trackingData?.form_id &&
      getFromData(formFilledData.trackingData?.form_id).then((res: any) => {
        if (res.status === 200) {
          setFormFilledData((prev) => {
            return {
              ...prev,
              formData: res.data[0],
            };
          });
        }
      });
  }, [formFilledData.trackingData?.form_id]);

  useEffect(() => {
    getCampainList().then((res: any) => {
      if (res.status === 200) {
        setCampainList(res.data);
      }
    });
  }, []);
  return (
    <>
      <div className="flex items-center justify-between md:flex-row flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          User Tracking
        </h1>
        <div className="flex items-center space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button ref={btnRef} variant="outline" className="hidden">
                Lead Information
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Lead Information</SheetTitle>
              </SheetHeader>
              <Card className="p-3 mt-5 shadow-none">
                <CardTitle>Tracking Details</CardTitle>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>IP</TableHead>
                      <TableCell>{formFilledData.trackingData?.ip}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Campaign Id</TableHead>
                      <TableCell>
                        {formFilledData.trackingData?.tk
                          ? formFilledData.trackingData?.tk
                          : "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Page Path</TableHead>
                      <TableCell>
                        {formFilledData.trackingData?.page_path}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Created At</TableHead>
                      <TableCell>
                        {new Date(
                          formFilledData.trackingData?.created_at
                        ).toDateString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
              <Card className="p-3 mt-5 shadow-none">
                <CardTitle>Form Data</CardTitle>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableCell>{formFilledData.formData?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Firm Name</TableHead>
                      <TableCell>
                        {formFilledData.formData?.firm_name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Designation</TableHead>
                      <TableCell>
                        {formFilledData.formData?.designation}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableCell>{formFilledData.formData?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Created At</TableHead>
                      <TableCell>
                        {new Date(
                          formFilledData.formData?.created_at
                        ).toDateString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </SheetContent>
          </Sheet>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Filter</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 pb-0 flex flex-col sm:flex-row gap-2">
                <div>
                  <Label>Records Per Page</Label>
                  <Select
                    onValueChange={(e) => {
                      setPaginationData((prev) => ({
                        ...prev,
                        perPage: parseInt(e),
                      })),
                        currentPageReset();
                    }}
                    defaultValue={paginationData.perPage.toString()}
                    value={paginationData.perPage.toString()}
                  >
                    <SelectTrigger className=" sm:w-[180px]">
                      <SelectValue placeholder="Records Per Page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="75">100</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Campaign Id</Label>
                  <Select
                    onValueChange={(e) => filterOnChange(e, "campainId")}
                    defaultValue={filterData.campainId}
                    value={filterData.campainId}
                  >
                    <SelectTrigger className=" sm:w-[180px]">
                      <SelectValue placeholder="Campain Id" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {campaginList?.length > 0 &&
                        campaginList.map((res) => (
                          <SelectItem key={uuidv4()} value={res.tk}>
                            {res.tk}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Is Form Filled</Label>
                  <Select
                    onValueChange={(e) => filterOnChange(e, "formFilled")}
                    defaultValue={filterData.formFilled}
                    value={filterData.formFilled}
                  >
                    <SelectTrigger className="sm:w-[180px]">
                      <SelectValue placeholder="Form Filled" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DrawerFooter>
                <div className="flex justify-end items-end gap-3">
                  <Button variant="secondary" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                  <DrawerClose>
                    <Button ref={filterCloseBtnRef}>Close</Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      {!loading && data?.length > 0 && (
        <>
          <Card className="p-2">
            <CardTitle className="flex justify-between items-center p-3 overflow-auto sm:overflow-hidden flex-nowrap">
              <Badge>Total Records : {paginationData.total}</Badge>
              <Badge>Total Pages : {paginationData.totalPages}</Badge>
              <div className="flex gap-2 justify-start items-center">
                <Badge variant="outline">
                  <IconFilter size={13} /> Records per Page :{" "}
                  {paginationData.perPage}
                </Badge>
                <Badge variant="outline">
                  <IconFilter size={13} /> Campagin id : {filterData.campainId}
                </Badge>
                <Badge variant="outline">
                  <IconFilter size={13} /> From Filled : {filterData.formFilled}
                </Badge>
              </div>
            </CardTitle>
            <Table>
              {/* <TableCaption>A list of recived Leads</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">S.No</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>campaign Id</TableHead>
                  <TableHead>Page Path</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Is From Filled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((res, i) => (
                  <TableRow key={uuidv4()}>
                    <TableCell className="font-medium h-6">
                      {paginationData.currentPage * paginationData.perPage -
                        paginationData.perPage +
                        (i + 1)}
                    </TableCell>
                    <TableCell>{res.ip}</TableCell>
                    <TableCell>{res.tk ? res.tk : "-"}</TableCell>
                    <TableCell>{res.page_path}</TableCell>
                    <TableCell>
                      {new Date(res.created_at).toDateString()}
                    </TableCell>
                    <TableCell>
                      {res.form_id ? (
                        <Badge
                          className="bg-green-600 text-white cursor-pointer"
                          onClick={() => formFilledBtn(res)}
                        >
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="destructive">No</Badge>
                      )}
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
        </>
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

export default UserTracking;

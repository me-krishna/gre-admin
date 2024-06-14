import { useEffect, useRef, useState } from "react";
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
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card, CardTitle } from "@/components/ui/card";
import TableLoader from "@/components/table-loader";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/page-title";
import api from "@/api/api";
import DrRajusPagination from "@/components/pagination";
import { Button } from "@/components/custom/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/use-toast";
import { set } from "date-fns";

const Leads = () => {
  const createBtnRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [submit, setSubmit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [listOfExamsPattrens, setListOfExamsPattrens] = useState<any[]>([]);
  const [formData, setFromData] = useState<{
    name: string;
    email: string;
    mobile: string;
    course: string;
    id?: string;
    password?: string;
    status?: string;
  }>({
    name: "",
    email: "",
    mobile: "",
    course: "",
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

  const inputsHandler = (key: string, val: string) => {
    setFromData((prev) => {
      return {
        ...prev,
        [key]: val,
      };
    });
  };

  const getExamsPattrens = async () => {
    try {
      const res = await api.get("/exam", {
        params: {
          page: 1,
          limit: 10000000,
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

  const fromErrorHandler = (error: string) => {
    toast({
      variant: "destructive",
      title: error,
    });
    setSubmit(false);
    return false;
  };

  const editbuttonHandler = (data: any) => {
    setFromData({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      course: data.course,
      id: data.id,
      password: data.password,
      status: data.status,
    });
    createBtnRef.current?.click();
  };

  const submitFrom = async () => {
    setSubmit(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
    const mobileRegex = /^[6789]\d{9}$/; // Regular expression for Indian mobile number validation

    if (formData.name.trim() === "") {
      fromErrorHandler("Name is Required");
    } else if (formData.email.trim() === "") {
      fromErrorHandler("Email is Required");
    } else if (!emailRegex.test(formData.email)) {
      fromErrorHandler("Invalid Email");
    } else if (formData.mobile.trim() === "") {
      fromErrorHandler("Mobile Number is Required");
    } else if (!mobileRegex.test(formData.mobile)) {
      fromErrorHandler("Invalid Mobile Number");
    } else if (formData.course === "") {
      fromErrorHandler("Course is Required");
    } else if (formData?.id && formData.password?.trim() === "") {
      fromErrorHandler("Password is Required");
    } else {
      try {
        const res = formData?.id
          ? await api.put("/students/" + formData.id, {
              name: formData.name,
              email: formData.email,
              mobile: formData.mobile,
              course: formData.course,
              password: formData.password,
              status: formData.status,
            })
          : await api.post("/students", formData);
        const { status, data } = res;
        if (status === 200) {
          Swal.fire({
            title: "Success",
            text: formData?.id
              ? "Student Data Updated Successfully"
              : "Student Created Successfully",
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1500,
            animation: true,
          }).then(() => {
            createBtnRef.current?.click();
            setFromData({
              name: "",
              email: "",
              mobile: "",
              course: "",
            });
          });

          getStudentsData();
          setSubmit(false);
        }
      } catch (error) {
        console.error(error);
        setSubmit(false);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    getStudentsData();
  }, [paginationData.currentPage]);

  useEffect(() => {
    getExamsPattrens();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Students"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Drawer>
            <DrawerTrigger asChild>
              <Button ref={createBtnRef} variant="outline">
                Create +
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Create Student</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => inputsHandler("name", e.target.value)}
                      type="text"
                      id="name"
                      placeholder="Enter Full Name"
                      name="name"
                      maxLength={120}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      value={formData.email}
                      onChange={(e) => inputsHandler("email", e.target.value)}
                      type="text"
                      id="email"
                      placeholder="Enter  Email"
                      name="email"
                      maxLength={120}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile" className="text-sm font-medium">
                      Mobile
                    </Label>
                    <Input
                      value={formData.mobile}
                      onChange={(e) => inputsHandler("mobile", e.target.value)}
                      type="text"
                      id="mobile"
                      placeholder="Enter Mobile Number"
                      name="mobile"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mobile" className="text-sm font-medium">
                      Course
                    </Label>
                    <Select
                      defaultValue={formData.course}
                      onValueChange={(val) => inputsHandler("course", val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Course ..." />
                      </SelectTrigger>
                      <SelectContent>
                        {listOfExamsPattrens.map((item) => (
                          <SelectItem key={uuidv4()} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData?.id && (
                    <>
                      <div>
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
                        >
                          Password
                        </Label>
                        <Input
                          value={formData.password}
                          onChange={(e) =>
                            inputsHandler("password", e.target.value)
                          }
                          type="text"
                          id="password"
                          placeholder="Enter Password"
                          name="password"
                          maxLength={8}
                          minLength={16}
                        />
                      </div>
                      <div>
                        <Label htmlFor="status" className="text-sm font-medium">
                          Status
                        </Label>
                        <Select
                          defaultValue={formData?.status?.toString()}
                          onValueChange={(val) => inputsHandler("status", val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Status ..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key={uuidv4()} value="1">
                              Active
                            </SelectItem>
                            <SelectItem key={uuidv4()} value="0">
                              In Active
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
                <DrawerFooter>
                  <Button disabled={submit} onClick={submitFrom}>
                    {submit ? "Submitting..." : "Submit"}
                  </Button>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
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
                <TableHead>Course</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Welcome Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((res, i) => (
                <TableRow key={uuidv4()}>
                  <TableCell className="font-medium">
                    {(paginationData.currentPage - 1) * data.length + i + 1}
                  </TableCell>
                  <TableCell>
                    {
                      listOfExamsPattrens.filter(
                        (re) => re?.id === res?.course
                      )[0]?.name
                    }
                  </TableCell>
                  <TableCell>{res.name}</TableCell>
                  <TableCell>{res.email}</TableCell>
                  <TableCell>{res.mobile}</TableCell>
                  <TableCell>{res.password}</TableCell>
                  <TableCell>
                    {res.status === 1 ? (
                      <Badge className="bg-green-200 text-green-700 hover:bg-green-300 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-200 text-red-700 hover:bg-red-300 dark:bg-red-700 dark:text-red-200 dark:hover:bg-red-800">
                        In Active
                      </Badge>
                    )}{" "}
                  </TableCell>
                  <TableCell>
                    {res.isWelcomeEmailSent === 1 ? (
                      <Badge className="bg-green-200 text-green-700 hover:bg-green-300 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-800">
                        Sent
                      </Badge>
                    ) : (
                      <Badge className="bg-red-200 text-red-700 hover:bg-red-300 dark:bg-red-700 dark:text-red-200 dark:hover:bg-red-800">
                        Not Sent
                      </Badge>
                    )}{" "}
                  </TableCell>
                  <TableCell>
                    {new Date(res.created_at).toDateString()}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Badge
                      className="cursor-pointer"
                      variant="default"
                      title="Edit the Student Details"
                      onClick={() => editbuttonHandler(res)}
                    >
                      <IconEdit size={18} />
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

import api from "@/api/api";
import PageTitle from "@/components/page-title";
import DrRajusPagination from "@/components/pagination";
import TableLoader from "@/components/table-loader";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { successMsg } from "@/lib/utils";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

const Topics = () => {
  const createBtnRef = useRef<HTMLButtonElement>(null);
  const updateBtnRef = useRef<HTMLButtonElement>(null);
  const initialData = {
    topicTitle: "",
    isHaveCalculator: false,
  };

  const [data, setData] = useState<any[]>([]);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [editFromData, setEditFromData] = useState({
    id: 0,
    name: "",
    isHaveCalculator: 0,
    status: 0,
  });

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleChekboxChange = (e: boolean) => {
    setFormData((prev) => {
      return {
        ...prev,
        isHaveCalculator: e,
      };
    });
  };
  const handleInputChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFromData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleChekboxChangeEdit = (e: boolean) => {
    setEditFromData((prev) => {
      return {
        ...prev,
        isHaveCalculator: e ? 1 : 0,
      };
    });
  };
  const handleRadioButton = (e: string) => {
    setEditFromData((prev) => {
      return {
        ...prev,
        status: e === "1" ? 1 : 0,
      };
    });
  };

  const editTopics = async (id: number) => {
    let topic = data[id];
    setEditFromData({
      id: topic.id,
      name: topic.name,
      isHaveCalculator: topic.isHaveCalculator,
      status: topic.status,
    });
    updateBtnRef.current?.click();
  };
  const deleteTopics = async (id: number) => {
    setSubmit(true);
    let topic = data[id];
    setEditFromData({
      id: topic.id,
      name: topic.name,
      isHaveCalculator: topic.isHaveCalculator,
      status: topic.status,
    });
    const isConfirmed = confirm("Are you sure you want to delete this topic?");
    if (isConfirmed) {
      try {
        const response = await api.post(`/topicsDelete/${topic.id}`, {
          isDelete: 1,
        });
        if (response.status === 200) {
          successMsg("Topic Deleted Successfully");
        }
      } catch (e) {
        console.error(e);
      }
    }
    setSubmit(false);
  };

  const getCurrentPage = (page: number) => {
    setPaginationData((prev) => {
      return {
        ...prev,
        currentPage: page,
      };
    });
  };

  const getListOfTopics = async () => {
    setLoading(true);
    try {
      const response = await api.get("/alltopics", {
        params: {
          page: paginationData.currentPage,
          perPage: paginationData.perPage,
        },
      });
      if (response.status === 200) {
        setData(response.data.data);
        setPaginationData((prev) => {
          return {
            ...prev,
            total: response.data.metadata.pagination.total_records,
            totalPages: response.data.metadata.pagination.total_pages,
          };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async () => {
    try {
      const response = await api.post("/createTopic", {
        topicName: formData.topicTitle,
        isHaveCalculator: formData.isHaveCalculator ? 1 : 0,
      });
      if (response.status === 200) {
        successMsg("Topic Created Successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateTopics = async () => {
    try {
      const response = await api.put(`/topics/${editFromData.id}`, {
        name: editFromData.name,
        isHaveCalculator: editFromData.isHaveCalculator,
        status: editFromData.status,
      });
      if (response.status === 200) {
        successMsg("Topic Updated Successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async () => {
    setSubmit(true);
    if (formData.topicTitle === "") {
      alert("Please enter topic title");
      setSubmit(false);
      return;
    } else {
      await createTopic();
      setFormData(initialData);
      setSubmit(false);
      createBtnRef.current?.click();
    }
  };

  const handleSubmitEdit = async () => {
    setSubmit(true);
    if (editFromData.name === "") {
      alert("Please enter topic title");
      setSubmit(false);
      return;
    } else {
      await updateTopics();
      setEditFromData({
        id: 0,
        name: "",
        isHaveCalculator: 0,
        status: 0,
      });
      setSubmit(false);
      updateBtnRef.current?.click();
    }
  };

  useEffect(() => {
    getListOfTopics();
  }, [paginationData.currentPage, submit]);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Topics"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button ref={createBtnRef} variant="outline">
                {" "}
                Create +
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Topic</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div>
                  <Label htmlFor="topicTitle" className="text-sm font-medium">
                    Topic Title
                  </Label>
                  <Input
                    onChange={handleInputChange}
                    value={formData.topicTitle}
                    type="text"
                    id="topicTitle"
                    placeholder="Enter Topic Title"
                    name="topicTitle"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="isHaveCalculator"
                    className="text-sm font-medium flex items-center gap-2 my-3"
                  >
                    <Checkbox
                      defaultChecked={formData.isHaveCalculator}
                      onCheckedChange={handleChekboxChange}
                      id="isHaveCalculator"
                      name="isHaveCalculator"
                    />
                    This Topic Have Calculator
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit}>
                  {submit ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild className="hidden">
              <Button ref={updateBtnRef} variant="outline">
                {" "}
                Update +
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Topic</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Topic Title
                  </Label>
                  <Input
                    onChange={handleInputChangeEdit}
                    value={editFromData.name}
                    type="text"
                    id="name"
                    placeholder="Enter Topic Title"
                    name="name"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="isHaveCalculatorEdit"
                    className="text-sm font-medium flex items-center gap-2 my-3"
                  >
                    <Checkbox
                      defaultChecked={
                        editFromData.isHaveCalculator === 1 ? true : false
                      }
                      onCheckedChange={handleChekboxChangeEdit}
                      id="isHaveCalculatorEdit"
                      name="isHaveCalculator"
                    />
                    This Topic Have Calculator
                  </Label>
                </div>
                <div>
                  <Label
                    htmlFor="statusCheck"
                    className="text-sm font-medium flex items-center gap-2 my-3"
                  >
                    Status
                    <RadioGroup
                      onValueChange={handleRadioButton}
                      defaultValue={editFromData.status.toString()}
                      className="flex gap-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="r1" />
                        <Label htmlFor="r1">Active</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="r2" />
                        <Label htmlFor="r2">In Active</Label>
                      </div>
                    </RadioGroup>
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmitEdit}>
                  {" "}
                  {submit ? "Updating..." : "Update"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <TableHead>Title</TableHead>
                <TableHead>Is Have Calculator?</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any, i: number) => (
                <TableRow key={v4()}>
                  <TableCell>
                    {(paginationData.currentPage - 1) * data.length + i + 1}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.isHaveCalculator ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {item.status === 1 ? (
                      <Badge className="bg-green-700 dark:text-slate-100">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-700 dark:text-slate-100">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="flex gap-2">
                      <Button variant="outline" onClick={() => editTopics(i)}>
                        <IconPencil size={20} />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteTopics(i)}
                      >
                        <IconTrash size={20} />
                      </Button>
                    </p>
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

export default Topics;

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { sub } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

const SubTopics = () => {
  const createBtnRef = useRef<HTMLButtonElement>(null);
  const updateBtnRef = useRef<HTMLButtonElement>(null);
  const initialData = {
    topicId: "",
    subTopicTitle: "",
  };

  const [data, setData] = useState<any[]>([]);
  const [listOfTopics, setListOfTopics] = useState<any[]>([]);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [editFromData, setEditFromData] = useState({
    id: 0,
    name: "",
    topicId: "",
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

  const handleSelectChange = (e: string) => {
    setFormData((prev) => {
      return {
        ...prev,
        topicId: e,
      };
    });
  };

  const getListTopics = async () => {
    try {
      const response = await api.get("/topics");
      if (response.status === 200) {
        setListOfTopics(response.data.data);
      }
    } catch (e) {
      console.error(e);
    }
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
  const handleSelectChangeEdit = (e: string) => {
    setEditFromData((prev) => {
      return {
        ...prev,
        topicId: e,
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
  const editSubTopics = async (id: number) => {
    let Subtopic = data[id];
    setEditFromData({
      id: Subtopic.id,
      name: Subtopic.name,
      topicId: Subtopic.topic_id,
      status: Subtopic.status,
    });
    updateBtnRef.current?.click();
  };
  // subtopics delete
  const deleteSubTopics = async (id: number) => {
    setSubmit(true);
    let subtopic = data[id];
    setEditFromData({
      id: subtopic.id,
      name: subtopic.name,
      topicId: subtopic.topic_id,
      status: subtopic.status,
    });
    const isConfirmed = confirm(
      "Are you sure you want to delete this subtopic?"
    );
    if (isConfirmed) {
      try {
        const response = await api.post(`/subtopicsDelete/${subtopic.id}`, {
          delete_status: 1,
        });
        if (response.status === 200) {
          successMsg("Subtopic Deleted Successfully");
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
  const getListOfSubTopics = async () => {
    setLoading(true);
    try {
      const response = await api.get("/subtopics", {
        params: {
          page: paginationData.currentPage,
          perPage: paginationData.perPage,
        },
      });
      if (response.status === 200) {
        console.log(response.data);
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
  const createSubTopic = async () => {
    try {
      const response = await api.post("/subtopics", {
        topicId: formData.topicId,
        subTopicName: formData.subTopicTitle,
      });
      if (response.status === 200) {
        successMsg("Subtopic Created Successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const updateSubTopics = async () => {
    try {
      const response = await api.put(`/subtopics/${editFromData.id}`, {
        name: editFromData.name,
        topic_id: editFromData.topicId,
        status: editFromData.status,
      });
      if (response.status === 200) {
        successMsg("Subtopic Updated Successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleSubmit = async () => {
    setSubmit(true);
    if (formData.topicId === "") {
      alert("Please Select Topic");
      setSubmit(false);
      return false;
    } else if (formData.subTopicTitle === "") {
      alert("Please enter Subtopic title");
      setSubmit(false);
      return false;
    } else {
      await createSubTopic();
      setFormData(initialData);
      setSubmit(false);
      createBtnRef.current?.click();
    }
  };
  const handleSubmitEdit = async () => {
    setSubmit(true);
    if (editFromData.topicId === "") {
      alert("Please Select Topic");
      setSubmit(false);
      return false;
    } else if (editFromData.name === "") {
      alert("Please enter Subtopic title");
      setSubmit(false);
      return false;
    } else {
      await updateSubTopics();
      setEditFromData({
        id: 0,
        name: "",
        topicId: "",
        status: 0,
      });
      setSubmit(false);
      updateBtnRef.current?.click();
    }
  };

  useEffect(() => {
    getListOfSubTopics();
  }, [paginationData.currentPage, submit]);

  useEffect(() => {
    getListTopics();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Sub Topics"></PageTitle>
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
                <DialogTitle>Create Subtopic</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div>
                  <Label htmlFor="topicTitle" className="text-sm font-medium">
                    Topic
                  </Label>
                  <Select
                    onValueChange={handleSelectChangeEdit}
                    defaultValue={formData.topicId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {listOfTopics.map((item) => (
                        <SelectItem value={item.id}> {item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="subTopicTitle"
                    className="text-sm font-medium"
                  >
                    Subtopic Title
                  </Label>
                  <Input
                    onChange={handleInputChange}
                    value={formData.subTopicTitle}
                    type="text"
                    id="subTopicTitle"
                    placeholder="Enter Subtopic Title"
                    name="subTopicTitle"
                  />
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
                <DialogTitle>Edit Subtopic</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div>
                  <Label htmlFor="topicTitle" className="text-sm font-medium">
                    Topic
                  </Label>
                  <Select
                    onValueChange={handleSelectChangeEdit}
                    defaultValue={editFromData.topicId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {listOfTopics.map((item) => (
                        <SelectItem value={item.id}> {item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="subTopicTitleEdit"
                    className="text-sm font-medium"
                  >
                    Subtopic Title
                  </Label>
                  <Input
                    onChange={handleInputChangeEdit}
                    value={editFromData.name}
                    type="text"
                    id="subTopicTitleEdit"
                    placeholder="Enter Subtopic Title"
                    name="name"
                  />
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
                <TableHead>Topic</TableHead>
                <TableHead>Title</TableHead>
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
                  <TableCell>{item.topicName}</TableCell>
                  <TableCell>{item.name}</TableCell>
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
                      <Button
                        variant="outline"
                        onClick={() => editSubTopics(i)}
                      >
                        <IconPencil size={20} />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteSubTopics(i)}
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

export default SubTopics;

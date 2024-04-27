import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconPlus } from "@tabler/icons-react";
import Editor from "@/components/custom/editor";

const CreateTest = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <PageTitle title="Tests Factory"></PageTitle>
        <div className="flex justify-end gap-2 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                Create <IconPlus size={14} />
              </Button>
            </SheetTrigger>

            <SheetContent className="sm:max-w-[90%] w-full">
              <SheetHeader>
                <SheetTitle>Create Test</SheetTitle>
              </SheetHeader>
              <div className="min-h-[800px] overflow-auto">
                <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                  <li className="flex items-center text-blue-600 dark:text-blue-500">
                    Section 1
                    <svg
                      className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 12 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m7 9 4-4-4-4M1 9l4-4-4-4"
                      />
                    </svg>
                  </li>
                  <li className="flex items-center">
                    Section 2
                    <svg
                      className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 12 10"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m7 9 4-4-4-4M1 9l4-4-4-4"
                      />
                    </svg>
                  </li>
                </ol>
                <div>
                  <Editor
                    filedName="question"
                    id="question"
                    placeholder="Enter Question Here..."
                    onChange={(data, filedName) => console.log(data, filedName)}
                  />
                  <Editor
                    filedName="ans1"
                    placeholder="Enter Answer 1 Here..."
                    id="ans1"
                    onChange={(data, filedName) => console.log(data, filedName)}
                  />
                  <Editor
                    filedName="ans2"
                    id="ans2"
                    onChange={(data, filedName) => console.log(data, filedName)}
                  />
                  <Editor
                    filedName="ans3"
                    id="ans3"
                    onChange={(data, filedName) => console.log(data, filedName)}
                  />
                </div>
              </div>
              <SheetFooter>
                <div className="flex justify-between items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
                  <Button variant="outline" className="border-gray-400">
                    Back
                  </Button>
                  <Button variant="outline" className="border-sky-400">
                    Next
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default CreateTest;

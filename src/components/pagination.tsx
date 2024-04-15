import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const DrRajusPagination = ({
  perPage,
  totalRecords,
  setCurrentPage,
  currentPage,
}: {
  perPage: number;
  totalRecords: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}) => {
  const totalPages = Math.ceil(totalRecords / perPage);
  const Pages = () => {
    const pages = [];
    let startPage = currentPage - 2 > 0 ? currentPage - 2 : 1;
    let endPage = currentPage + 2 < totalPages ? currentPage + 2 : totalPages;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2 < totalPages ? currentPage + 2 : totalPages;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            className="cursor-pointer"
            isActive={currentPage === i}
            size={"sm"}
            onClick={() => pageSelect(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  const pageSelect = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-2">
      <Pagination className=" bg-slate-100 dark:bg-gray-700">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={`${currentPage === 1 ? "pointer-events-none text-slate-400" : ""} cursor-pointer`}
              onClick={() => pageSelect(currentPage - 1)}
            />
          </PaginationItem>
          {Pages()}
          <PaginationItem>
            <PaginationNext
              className={`${currentPage === totalPages ? "pointer-events-none text-slate-400"  : ""} cursor-pointer`}
              onClick={() => pageSelect(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DrRajusPagination;

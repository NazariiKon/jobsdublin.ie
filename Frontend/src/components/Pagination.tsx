import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


interface MyPaginationProps {
    currentPage: any,
    setCurrentPage: any,
    pagination: any,
}

export default function MyPagination({ currentPage, setCurrentPage, pagination }: MyPaginationProps) {
    const start = Math.max(currentPage - 2, 1);
    const step = currentPage > 3 ? 2 : (4 - currentPage + 1)
    const end = Math.min(currentPage + step, pagination.total_pages);

    const pages = Array.from({ length: end - start + 1 }, (_, i) => i + start);
    return (
        <Pagination>
            <PaginationContent>
                {pagination.has_prev &&
                    <PaginationItem className="cursor-pointer">
                        <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
                    </PaginationItem>
                }

                {pages.map((page) => (
                    <PaginationItem onClick={() => setCurrentPage(page)} className="cursor-pointer" key={page}>
                        <PaginationLink isActive={currentPage == page}>{page}</PaginationLink>
                    </PaginationItem>
                ))}
                {pagination.total_pages > 5 && currentPage < pagination.total_pages - 2 &&
                    <>
                        < PaginationItem >
                            <PaginationEllipsis />
                        </PaginationItem>
                    </>
                }
                {pagination.has_next &&
                    <PaginationItem className="cursor-pointer">
                        <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
                    </PaginationItem>
                }
            </PaginationContent>
        </Pagination>
    )
}
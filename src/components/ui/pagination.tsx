import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
    <nav
        role="navigation"
        aria-label="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
    />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
    HTMLUListElement,
    React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
    />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
    HTMLLIElement,
    React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
    isActive?: boolean
} & Pick<VariantProps<typeof buttonVariants>, "size"> &
    React.ComponentProps<"a">

const PaginationLink = ({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) => (
    <a
        aria-current={isActive ? "page" : undefined}
        className={cn(
            buttonVariants({
                variant: isActive ? "outline" : "ghost",
                size,
            }),
            className
        )}
        {...props}
    />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to previous page"
        size="default"
        className={cn("gap-1 pl-2.5", className)}
        {...props}
    >
        <ChevronLeft className="h-4 w-4" />
        <span>Anterior</span>
    </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<typeof PaginationLink>) => (
    <PaginationLink
        aria-label="Go to next page"
        size="default"
        className={cn("gap-1 pr-2.5", className)}
        {...props}
    >
        <span>Próximo</span>
        <ChevronRight className="h-4 w-4" />
    </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<"span">) => (
    <span
        aria-hidden
        className={cn("flex h-9 w-9 items-center justify-center", className)}
        {...props}
    >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More pages</span>
    </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    DataTablePagination,
}

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Linhas por página</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Primeira página</span>
                        <ChevronLeft className="h-4 w-4" />
                        <ChevronLeft className="h-4 w-4 -ml-2" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Página anterior</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Próxima página</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Última página</span>
                        <ChevronRight className="h-4 w-4" />
                        <ChevronRight className="h-4 w-4 -ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

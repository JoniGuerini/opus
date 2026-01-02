
"use client"

import * as React from "react"
import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FacetedFilter } from "@/components/ui/faceted-filter"
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from "@/constants/user-options"
import { Table } from "@tanstack/react-table"

interface UsersTableToolbarProps<TData> {
    table: Table<TData>
    children?: React.ReactNode
}

export function UsersTableToolbar<TData>({
    table,
    children,
}: UsersTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filtrar por nome..."
                    value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("fullName")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("globalRole") && (
                    <FacetedFilter
                        title="Cargo"
                        options={USER_ROLE_OPTIONS}
                        selectedValues={new Set(table.getColumn("globalRole")?.getFilterValue() as string[])}
                        onSelect={(values) => table.getColumn("globalRole")?.setFilterValue(Array.from(values))}
                    />
                )}
                {table.getColumn("status") && (
                    <FacetedFilter
                        title="Status"
                        options={USER_STATUS_OPTIONS}
                        selectedValues={new Set(table.getColumn("status")?.getFilterValue() as string[])}
                        onSelect={(values) => table.getColumn("status")?.setFilterValue(Array.from(values))}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Resetar
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            {children}
        </div>
    )
}

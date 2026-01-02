"use client"

import * as React from "react"
import { useApp } from "@/contexts/app-context"
import { CreateUserDialog } from "@/components/forms"
import { UsersDataTable } from "@/components/users-data-table"
import { columns } from "@/components/users-table-columns"

export default function TeamPage() {
    const { users } = useApp()
    const [orderedUsers, setOrderedUsers] = React.useState(users)

    React.useEffect(() => {
        setOrderedUsers(users)
    }, [users])

    return (
        <div className="space-y-4">
            <UsersDataTable
                data={orderedUsers}
                setData={setOrderedUsers}
                columns={columns}
                toolbarAction={<CreateUserDialog />}
            />
        </div>
    )
}

